-- ============================================================
-- Migración 002: Row Level Security + buckets de Storage
-- Lectura pública SOLO de contenido publicado.
-- Escritura SOLO para usuarios autenticados (admin, 1-2 cuentas).
-- ============================================================

alter table public.posts enable row level security;
alter table public.gallery_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.stats enable row level security;
alter table public.proposal_groups enable row level security;
alter table public.proposals enable row level security;
alter table public.site_config enable row level security;
alter table public.contact_messages enable row level security;

-- Limpieza idempotente de políticas previas
drop policy if exists "posts_publicos_legibles" on public.posts;
drop policy if exists "posts_admin_total" on public.posts;
drop policy if exists "gallery_publica" on public.gallery_images;
drop policy if exists "gallery_admin" on public.gallery_images;
drop policy if exists "testimonios_publicos" on public.testimonials;
drop policy if exists "testimonios_admin" on public.testimonials;
drop policy if exists "stats_publicos" on public.stats;
drop policy if exists "stats_admin" on public.stats;
drop policy if exists "groups_publicos" on public.proposal_groups;
drop policy if exists "groups_admin" on public.proposal_groups;
drop policy if exists "proposals_publicas" on public.proposals;
drop policy if exists "proposals_admin" on public.proposals;
drop policy if exists "config_publica" on public.site_config;
drop policy if exists "config_admin" on public.site_config;
drop policy if exists "contacto_insert_publico" on public.contact_messages;
drop policy if exists "contacto_admin" on public.contact_messages;

-- posts: el público solo ve publicados
create policy "posts_publicos_legibles" on public.posts
  for select using (estado = 'publicado');
-- admin autenticado: todo
create policy "posts_admin_total" on public.posts
  for all to authenticated using (true) with check (true);

create policy "gallery_publica" on public.gallery_images
  for select using (true);
create policy "gallery_admin" on public.gallery_images
  for all to authenticated using (true) with check (true);

create policy "testimonios_publicos" on public.testimonials
  for select using (true);
create policy "testimonios_admin" on public.testimonials
  for all to authenticated using (true) with check (true);

create policy "stats_publicos" on public.stats
  for select using (true);
create policy "stats_admin" on public.stats
  for all to authenticated using (true) with check (true);

create policy "groups_publicos" on public.proposal_groups
  for select using (true);
create policy "groups_admin" on public.proposal_groups
  for all to authenticated using (true) with check (true);

create policy "proposals_publicas" on public.proposals
  for select using (true);
create policy "proposals_admin" on public.proposals
  for all to authenticated using (true) with check (true);

create policy "config_publica" on public.site_config
  for select using (true);
create policy "config_admin" on public.site_config
  for all to authenticated using (true) with check (true);

-- contacto: cualquiera puede insertar (formulario público), solo admin lee/actualiza
create policy "contacto_insert_publico" on public.contact_messages
  for insert with check (true);
create policy "contacto_admin" on public.contact_messages
  for all to authenticated using (true) with check (true);

-- ---------- Storage ----------
-- Crear con: insert into storage.buckets ... (requiere permisos).
-- Si ya existen, no falla gracias a on conflict.
insert into storage.buckets (id, name, public)
  values ('imagenes', 'imagenes', true),
         ('documentos', 'documentos', true)
  on conflict (id) do nothing;

drop policy if exists "lectura_publica_imagenes" on storage.objects;
drop policy if exists "admin_escribe_imagenes" on storage.objects;
drop policy if exists "lectura_publica_documentos" on storage.objects;
drop policy if exists "admin_escribe_documentos" on storage.objects;

create policy "lectura_publica_imagenes" on storage.objects
  for select using (bucket_id = 'imagenes');
create policy "admin_escribe_imagenes" on storage.objects
  for all to authenticated using (bucket_id = 'imagenes') with check (bucket_id = 'imagenes');

create policy "lectura_publica_documentos" on storage.objects
  for select using (bucket_id = 'documentos');
create policy "admin_escribe_documentos" on storage.objects
  for all to authenticated using (bucket_id = 'documentos') with check (bucket_id = 'documentos');
