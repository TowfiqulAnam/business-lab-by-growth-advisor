import { createClient } from 'npm:@supabase/supabase-js@2.49.8';
import { JWT } from 'npm:google-auth-library@9.15.1';

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(x => x.trim()).filter(Boolean);
const maxBody = 90000;
function response(origin: string, status: number, data: unknown) {
  return new Response(JSON.stringify(data), {status, headers:{
    'Content-Type':'application/json', 'Cache-Control':'no-store',
    'Access-Control-Allow-Origin':origin, 'Vary':'Origin',
    'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods':'POST, OPTIONS'
  }});
}
function cleanString(value: unknown, max: number, required = true): string {
  if(typeof value !== 'string' || value.length > max || (required && !value.trim())) throw Error('INVALID_FIELD');
  return value.trim();
}
function num(value: unknown): number {return typeof value==='number' && Number.isFinite(value) ? value : 0;}
function textCell(value: unknown): string {return String(value ?? '').replace(/^[\s]*([=+@-])/, "'$1");}

Deno.serve(async req => {
  const origin=req.headers.get('origin') || '';
  if(!allowedOrigins.includes(origin)) return new Response('Origin not allowed',{status:403});
  if(req.method==='OPTIONS') return response(origin,200,{ok:true});
  if(req.method!=='POST') return response(origin,405,{error:'METHOD_NOT_ALLOWED'});
  try {
    const authorization=req.headers.get('authorization')||'';
    if(!authorization.startsWith('Bearer ')) return response(origin,401,{error:'SIGN_IN_REQUIRED'});
    const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error:authError}=await admin.auth.getUser(authorization.slice(7));
    if(authError||!user?.email_confirmed_at) return response(origin,401,{error:'VERIFIED_EMAIL_REQUIRED'});
    if(Number(req.headers.get('content-length')||0)>maxBody) return response(origin,413,{error:'TOO_LARGE'});
    // Bound streamed requests too; Content-Length alone is untrusted.
    const reader=req.body?.getReader();if(!reader) return response(origin,400,{error:'EMPTY_BODY'});
    let raw='',bytes=0;const decoder=new TextDecoder();
    while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>maxBody){await reader.cancel();return response(origin,413,{error:'TOO_LARGE'});}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
    const input=JSON.parse(raw);
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)||input.consent!==true)throw Error('INVALID_FIELD');
    const c=input.contact||{};
    const contact={name:cleanString(c.name,100),phone:cleanString(c.phone,25),email:cleanString(c.email,150),city:cleanString(c.city,100),business:cleanString(c.business,100),stage:cleanString(c.stage,40),plan:cleanString(c.plan,1800),capital:num(c.capital),bottlenecks:[] as string[],notes:cleanString(c.notes,1200,false)};
    if(!/^\+?[\d\s()\-]{7,25}$/.test(contact.phone)||!/^\S+@\S+\.\S+$/.test(contact.email)||!['Idea Stage','Newly Launched','Existing SME Scaling'].includes(contact.stage)||typeof c.capital!=='number'||c.capital<0||c.capital>1e9||!Array.isArray(c.bottlenecks)||c.bottlenecks.length>10)throw Error('INVALID_FIELD');
    contact.bottlenecks=c.bottlenecks.map((v:unknown)=>cleanString(v,80));
    if(!contact.bottlenecks.length&&!contact.notes)throw Error('INVALID_FIELD');
    const m=input.metrics||{};const metrics:Record<string,number>={};
    for(const key of ['days','cash','revenue','cogs','marketing','courier','profit','roi','delivered','rto','peak'])metrics[key]=num(m[key]);
    metrics.capital=num(m.config?.capital);
    const brief=cleanString(input.brief,16000);
    const body={contact,metrics,brief,consent:true,verifiedEmail:user.email};
    const {data:accepted,error}=await admin.rpc('accept_consultation',{lead_id:input.id,owner_id:user.id,content:body});
    if(error) return response(origin,error.message.includes('RATE_LIMIT')?429:400,{error:'REQUEST_NOT_ACCEPTED'});
    const lead=Array.isArray(accepted)?accepted[0]:accepted;
    if(!lead?.id) return response(origin,500,{error:'REQUEST_NOT_CONFIRMED'});
    if(lead.sheet_synced_at)return response(origin,200,{accepted:true,sheetSynced:true,id:lead.id});
    try {
      const credentials=JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')||'{}');
      const google=new JWT({email:credentials.client_email,key:credentials.private_key,scopes:['https://www.googleapis.com/auth/spreadsheets']});
      const {access_token}=await google.authorize();
      if(!access_token)throw Error('GOOGLE_AUTH_FAILED');
      // Read canonical stored content on retry; never change an existing lead with a repeated ID.
      const d=lead.body.contact,s=lead.body.metrics;
      const row=[lead.id,lead.created_at,lead.created_at,d.name,d.phone,d.email,d.city,d.business,d.stage,d.capital,d.plan,d.bottlenecks.join(' | '),d.notes,'Private form',s.days,s.capital,s.cash,s.revenue,s.cogs,s.marketing,s.courier,s.profit,s.roi,s.delivered,s.rto,s.peak,true,lead.body.brief];
      const sheetId=Deno.env.get('GOOGLE_SHEET_ID');
      const range=`'Consultations'!A${lead.sheet_row}:AB${lead.sheet_row}`;
      const url=`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId!)}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
      const saved=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${access_token}`,'Content-Type':'application/json'},body:JSON.stringify({values:[row.map(v=>typeof v==='string'?textCell(v):v)]}),signal:AbortSignal.timeout(15000)});
      if(!saved.ok)throw Error('SHEET_WRITE_FAILED');
      const {error:updateError}=await admin.from('consultation_leads').update({sheet_synced_at:new Date().toISOString()}).eq('id',lead.id);
      if(updateError)throw Error('STATUS_UPDATE_FAILED');
      return response(origin,200,{accepted:true,sheetSynced:true,id:lead.id});
    } catch {
      // The canonical private record survives a Google outage. A same-ID retry rewrites
      // the same allocated Sheet row, so no duplicate append or lost acknowledgement.
      console.error('Sheet delivery pending for lead',lead.id);
      return response(origin,202,{accepted:true,sheetSynced:false,id:lead.id});
    }
  } catch {return response(origin,400,{error:'INVALID_REQUEST'});}
});
