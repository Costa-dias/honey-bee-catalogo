-- Four stock administrators; invitations can only be issued by the database owner.
create schema honeybee_private;
revoke all on schema honeybee_private from public, anon, authenticated, service_role;
create table honeybee_private.members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 active boolean not null default true
);
create table honeybee_private.invitations (
 token_hash text primary key,
 email text not null,
 expires_at timestamptz not null,
 used_at timestamptz,
 used_by uuid references auth.users(id) on delete set null
);
alter table honeybee_private.members enable row level security;
alter table honeybee_private.invitations enable row level security;
revoke all on all tables in schema honeybee_private from public, anon, authenticated, service_role;
do $$
begin
 if (select count(*) from auth.users) <> 1 or
    (select count(*) from auth.users where email_confirmed_at is not null) <> 1 then
   raise exception 'Expected exactly one existing confirmed owner; review before applying.';
 end if;
 insert into honeybee_private.members(user_id) select id from auth.users;
end $$;
create function honeybee_private.generate_invitation(invited_email text, valid_days integer default 7)
returns table(invitation_code text, valid_until timestamptz)
language plpgsql security invoker set search_path = ''
as $$
declare target text := lower(trim(invited_email)); token text; deadline timestamptz;
begin
 perform pg_catalog.pg_advisory_xact_lock(721049001);
 if target is null or target !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then
  raise exception 'Informe um e-mail válido.';
 end if;
 if valid_days is null or valid_days < 1 or valid_days > 30 then raise exception 'Validade deve ser de 1 a 30 dias.'; end if;
 if (select count(*) from honeybee_private.members where active) >= 4 then raise exception 'Limite de quatro contas atingido.'; end if;
 if exists(select 1 from auth.users where lower(email)=target) then raise exception 'Este e-mail já possui conta.'; end if;
 token := encode(extensions.gen_random_bytes(32),'hex');
 deadline := now() + pg_catalog.make_interval(days => valid_days);
 update honeybee_private.invitations set expires_at=now()
 where email=target and used_at is null and expires_at>now();
 insert into honeybee_private.invitations(token_hash,email,expires_at)
 values(encode(extensions.digest(token,'sha256'),'hex'),target,deadline);
 return query select token,deadline;
end $$;
revoke all on function honeybee_private.generate_invitation(text,integer) from public, anon, authenticated, service_role, supabase_auth_admin;
grant usage on schema honeybee_private to postgres;
grant execute on function honeybee_private.generate_invitation(text,integer) to postgres;

create function honeybee_private.admit_user()
returns trigger language plpgsql security definer set search_path=''
as $$
declare accepted text;
begin
 perform pg_catalog.pg_advisory_xact_lock(721049001);
 if (select count(*) from honeybee_private.members where active) >= 4 then raise exception 'Cadastro não autorizado.'; end if;
 update honeybee_private.invitations
 set used_at=now(),used_by=new.id
 where token_hash=encode(extensions.digest(coalesce(new.raw_user_meta_data->>'invite_code',''),'sha256'),'hex')
   and email=lower(trim(new.email)) and expires_at>now() and used_at is null
 returning token_hash into accepted;
 if accepted is null then raise exception 'Cadastro não autorizado.'; end if;
 insert into honeybee_private.members(user_id) values(new.id);
 update auth.users set raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb)-'invite_code' where id=new.id;
 return new;
end $$;
revoke all on function honeybee_private.admit_user() from public, anon, authenticated, service_role;
create trigger honeybee_admit_user after insert on auth.users
for each row execute function honeybee_private.admit_user();

create function honeybee_private.is_admin()
returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from honeybee_private.members where user_id=(select auth.uid()) and active) $$;
revoke all on function honeybee_private.is_admin() from public, anon, authenticated, service_role;
grant usage on schema honeybee_private to authenticated;
grant execute on function honeybee_private.is_admin() to authenticated;

-- A verifier is a narrowly scoped public endpoint, never an invitation issuer.
create function public.verify_registration_code(input_code text,input_email text)
returns boolean language sql stable security definer set search_path=''
as $$
 select (select count(*) from honeybee_private.members where active)<4
 and exists(select 1 from honeybee_private.invitations
 where token_hash=encode(extensions.digest(input_code,'sha256'),'hex')
 and email=lower(trim(input_email)) and expires_at>now() and used_at is null)
$$;
revoke all on function public.verify_registration_code(text,text) from public;
grant execute on function public.verify_registration_code(text,text) to anon,authenticated;
revoke all on function public.verify_registration_code(text) from public,anon,authenticated,service_role;
revoke all on function public.consume_registration_code(text) from public,anon,authenticated,service_role;
revoke all on public.registration_codes from anon,authenticated;

alter policy admin_read_all_baskets on public.baskets using ((select honeybee_private.is_admin()));
alter policy admin_insert_baskets on public.baskets with check ((select honeybee_private.is_admin()));
alter policy admin_update_baskets on public.baskets using ((select honeybee_private.is_admin())) with check ((select honeybee_private.is_admin()));
alter policy admin_delete_baskets on public.baskets using ((select honeybee_private.is_admin()));
alter policy admin_read_stock on public.stock_movements using ((select honeybee_private.is_admin()));
alter policy admin_insert_stock on public.stock_movements with check ((select honeybee_private.is_admin()));
alter policy admin_update_stock on public.stock_movements using ((select honeybee_private.is_admin())) with check ((select honeybee_private.is_admin()));
alter policy admin_delete_stock on public.stock_movements using ((select honeybee_private.is_admin()));
alter policy admin_insert_basket_images on storage.objects with check (bucket_id='baskets' and (select honeybee_private.is_admin()));
alter policy admin_update_basket_images on storage.objects using (bucket_id='baskets' and (select honeybee_private.is_admin())) with check (bucket_id='baskets' and (select honeybee_private.is_admin()));
alter policy admin_delete_basket_images on storage.objects using (bucket_id='baskets' and (select honeybee_private.is_admin()));
revoke all on public.stock_movements from anon;
revoke insert,update,delete,truncate,references,trigger on public.baskets from anon;
revoke truncate,references,trigger on public.baskets,public.stock_movements from authenticated;
update storage.buckets set file_size_limit=15728640,
allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'] where id='baskets';
