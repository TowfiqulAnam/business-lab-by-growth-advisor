-- Run once in the Supabase SQL editor. Public client keys never bypass RLS.
create table public.workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) < 2000000),
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.workspaces enable row level security;
revoke all on public.workspaces from anon, authenticated;
grant select on public.workspaces to authenticated;
create policy own_workspace_read on public.workspaces for select to authenticated using ((select auth.uid()) = user_id);

create function public.save_workspace(payload jsonb, expected_revision bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); next_revision bigint;
begin
  if uid is null then raise exception 'NOT_AUTHENTICATED'; end if;
  if payload->>'version' is distinct from '1' or jsonb_typeof(payload->'values') is distinct from 'object'
     or octet_length(payload::text) >= 2000000 then raise exception 'INVALID_WORKSPACE'; end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text, 1));
  if expected_revision = 0 then
    insert into public.workspaces(user_id,payload,revision) values(uid,payload,1)
      on conflict do nothing returning revision into next_revision;
  else
    update public.workspaces w set payload=save_workspace.payload,
      revision=w.revision+1,updated_at=now()
      where w.user_id=uid and w.revision=expected_revision returning revision into next_revision;
  end if;
  if next_revision is null then raise exception 'WORKSPACE_CONFLICT'; end if;
  return next_revision;
end $$;
revoke all on function public.save_workspace(jsonb,bigint) from public, anon;
grant execute on function public.save_workspace(jsonb,bigint) to authenticated;

create table public.consultation_leads (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  sheet_row bigint generated always as identity (start with 2) unique,
  created_at timestamptz not null default now(),
  body jsonb not null,
  sheet_synced_at timestamptz,
  check(octet_length(body::text) < 100000)
);
alter table public.consultation_leads enable row level security;
revoke all on public.consultation_leads from anon, authenticated;
grant all on public.consultation_leads to service_role;
-- No visitor SELECT policy. Owner manages leads through private Sheets / Supabase dashboard.
create function public.accept_consultation(lead_id uuid, owner_id uuid, content jsonb)
returns public.consultation_leads language plpgsql security definer set search_path='' as $$
declare row public.consultation_leads;
begin
  perform pg_advisory_xact_lock(hashtextextended(owner_id::text, 2));
  select * into row from public.consultation_leads where id=lead_id;
  if found then
    if row.user_id <> owner_id then raise exception 'INVALID_REQUEST'; end if;
    return row;
  end if;
  if (select count(*) from public.consultation_leads where user_id=owner_id and created_at>now()-interval '1 hour') >= 5 then
    raise exception 'RATE_LIMIT';
  end if;
  insert into public.consultation_leads(id,user_id,body) values(lead_id,owner_id,content) returning * into row;
  return row;
end $$;
revoke all on function public.accept_consultation(uuid,uuid,jsonb) from public, anon, authenticated;
grant execute on function public.accept_consultation(uuid,uuid,jsonb) to service_role;
