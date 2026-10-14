-- ============================================================
-- Tablas base del sitio: noticias/columnas, fotos, testimonios,
-- numeros, temas, propuestas, configuracion y mensajes.
-- Se ejecuta primero en el editor SQL de Supabase.
-- ============================================================

-- ---------- posts (noticias + columnas) ----------
-- Aqui van noticias y columnas juntas, el campo tipo dice cual es.
-- Estado dice si ya se ve en publico (publicado) o aun no (borrador).
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('noticia', 'columna')),
  titulo text not null,
  slug text not null unique,
  extracto text,
  contenido text not null default '',
  imagen_url text,
  categoria text,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists posts_tipo_estado_idx on public.posts (tipo, estado);
create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_published_idx on public.posts (published_at desc nulls last);

-- ---------- galería ----------
-- Fotos de campaña. Orden dice en que posicion salen.
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  titulo text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- testimonios ----------
-- Opiniones de la gente que salen en el carrusel del inicio.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  municipio text,
  foto_url text,
  texto text not null,
  orden integer not null default 0
);

-- ---------- estadísticas del hero ----------
-- Numeros del inicio, ej "32 municipios". Icono es el dibujo que acompaña.
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  etiqueta text not null,
  valor text not null,
  icono text,
  orden integer not null default 0
);

-- ---------- propuestas ----------
-- Temas grandes (ej Salud) y propuestas chicas dentro de cada tema.
-- Si se borra un tema, se borran sus propuestas automaticamente.
create table if not exists public.proposal_groups (
  id uuid primary key default gen_random_uuid(),
  tema text not null,
  orden integer not null default 0
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.proposal_groups(id) on delete cascade,
  titulo text not null,
  descripcion text,
  orden integer not null default 0
);
create index if not exists proposals_group_idx on public.proposals (group_id);

-- ---------- configuración del sitio (singleton, id = 1) ----------
-- Solo hay una fila con id 1. Aqui va eslogan, biografia, fotos y pdf. No crear mas filas.
create table if not exists public.site_config (
  id integer primary key check (id = 1),
  eslogan text not null default '',
  sobre_mi text,
  sobre_mi_foto_url text,
  pdf_plan_url text,
  hero_imagen_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_config (id, eslogan)
  values (1, 'La selva florece con trabajo honesto')
  on conflict (id) do nothing;

-- ---------- mensajes de contacto / voluntarios ----------
-- Lo que deja la gente en el formulario. Leido sirve para saber si ya se atendio.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  whatsapp text,
  email text,
  municipio text,
  mensaje text not null,
  leido boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists contact_leido_idx on public.contact_messages (leido, created_at desc);
