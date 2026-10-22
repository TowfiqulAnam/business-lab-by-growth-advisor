// Node 24+. Unit tests use mock Auth/database/Google services, never live credentials.
const {stripTypeScriptTypes}=require('node:module');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
let handler,googleFails=false,writes=0;
const records=new Map();
const admin={
 auth:{getUser:async token=>token==='verified-token'?{data:{user:{id:'user-a',email:'owner@example.com',email_confirmed_at:'2026-10-23'}},error:null}:{data:{user:null},error:Error('unauthorized')}},
 rpc:async(name,{lead_id,owner_id,content})=>{let row=records.get(lead_id);if(!row){row={id:lead_id,user_id:owner_id,sheet_row:records.size+2,created_at:'2026-10-23T00:00:00Z',body:content};records.set(lead_id,row);}return {data:row,error:null};},
 from:()=>({update:values=>({eq:async(_,id)=>{Object.assign(records.get(id),values);return {error:null};}})})
};
const env={ALLOWED_ORIGINS:'https://business.example',SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'unit-test-only',GOOGLE_SERVICE_ACCOUNT_JSON:'{"client_email":"test@example.com","private_key":"mock"}',GOOGLE_SHEET_ID:'test-sheet'};
const source=fs.readFileSync(path.join(__dirname,'../functions/submit-lead/index.ts'),'utf8').replace(/^import .*;\r?\n/gm,'');
vm.runInNewContext(stripTypeScriptTypes(source),{Deno:{env:{get:k=>env[k]},serve:fn=>handler=fn},createClient:()=>admin,JWT:class{async authorize(){return {access_token:'google-mock'};}},Response,Request,TextDecoder,AbortSignal,console:{error:()=>{}},fetch:async(url,options)=>{writes++;const data=JSON.parse(options.body);assert.equal(data.values[0].length,28);assert.ok(url.includes('valueInputOption=RAW'));return new Response('{}',{status:googleFails?503:200});}});
const lead={id:'abcde012-3456-4123-8123-012345678901',consent:true,contact:{name:'Test',phone:'01800000000',email:'test@example.com',city:'Dhaka',business:'Test business',stage:'Idea Stage',plan:'Validate delivery economics',capital:100000,bottlenecks:['Pricing/Margins'],notes:''},metrics:{days:0,config:{capital:100000}},brief:'Test only'};
const request=(body,token='verified-token',origin='https://business.example')=>new Request('https://function.example',{method:'POST',headers:{origin,authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(body)});
(async()=>{
 assert.equal((await handler(request(lead,'invalid'))).status,401);
 assert.equal((await handler(request(lead,'verified-token','https://evil.example'))).status,403);
 assert.equal((await handler(request({...lead,consent:false}))).status,400);
 assert.equal((await handler(request({...lead,contact:{...lead.contact,phone:'bad'}}))).status,400);
 googleFails=true;let response=await handler(request(lead));assert.equal(response.status,202);assert.equal((await response.json()).sheetSynced,false);assert.equal(records.size,1);
 googleFails=false;response=await handler(request(lead));assert.equal((await response.json()).sheetSynced,true);assert.equal(records.size,1);assert.equal(writes,2);
 response=await handler(request(lead));assert.equal((await response.json()).sheetSynced,true);assert.equal(writes,2,'Already-synced requests do not rewrite Sheets');
 assert.equal((await handler(request({...lead,brief:'x'.repeat(95000)}))).status,413);
 console.log('PASS: auth/origin/consent/field checks, bounded body, pending delivery, idempotent retry. Database RLS still requires live acceptance checks.');
})().catch(e=>{console.error(e);process.exitCode=1;});
