# 🌱 Sitio de campaña — Candidato a la Gobernación

Página informativa de campaña política (NO es red social): los visitantes solo
leen contenido. El candidato o su equipo publica desde el panel `/admin`
protegido con login de Supabase Auth.

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase**
(PostgreSQL, Storage, Auth) + `next/image`.

---

## 1. Instalación

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:3000
```

## 2. Configuración de Supabase (paso a paso)

1. **Crea el proyecto** en [supabase.com](https://supabase.com) → copia la
   `Project URL` y la `anon public key` (Settings → API).
2. **Corre las migraciones**: abre el SQL Editor y ejecuta en orden los
   archivos de `supabase/migrations/`:
   - `001_schema.sql` → crea las tablas
   - `002_rls_storage.sql` → activa RLS y crea los buckets `imagenes` y
     `documentos` (públicos en lectura, escritura solo autenticada)
   - `003_seed.sql` → datos de ejemplo (bórralos desde `/admin` al publicar)
3. **Crea el usuario admin**: Authentication → Users → *Add user* →
   correo + contraseña (1-2 cuentas máximo).
   > Recomendado: activa 2FA/MFA para esas cuentas (Authentication → MFA).
4. **Variables de entorno** en `.env.local` (ver `.env.example`):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (solo servidor/scripts),
   `NEXT_PUBLIC_SITE_URL` (tu dominio en producción).
5. **Anti-spam (opcional pero recomendado)**: crea una cuenta de
   Cloudflare Turnstile o hCaptcha y configura `*_SITE_KEY` y `*_SECRET_KEY`.
   Sin claves, el formulario usa honeypot + validación básica.

## 3. Cambiar nombre, eslogan, colores y logo

Todo centralizado en **`lib/constants.ts`** (`SITE` y `COLORS`):

| Qué | Dónde |
|---|---|
| Nombre, eslogan, cargo, email, WhatsApp, dirección, redes | `SITE` en `lib/constants.ts` |
| Colores (verde `#1B5E20`, selva `#2E7D32`, lima `#C6D92E`, crema `#F5F5ED`) | `COLORS` en `lib/constants.ts` + `@theme` en `app/globals.css` |
| Logo (inicial en círculo) | se genera de `SITE.candidatoCorto` en `Header.tsx` |
| Hero, biografía, foto, PDF del plan | editables en `/admin/sobre-mi` y `/admin/propuestas` (tabla `site_config`) |
| SEO por defecto | `app/layout.tsx` (usa `SITE`) |

## 4. Uso del panel `/admin`

- Entra a **`/admin/login`** con el usuario creado en Supabase.
- **Noticias / Columnas**: crear, editar, borrador/publicar, eliminar +
  vista previa. El editor permite negritas, listas, citas, enlaces,
  imágenes y videos de YouTube. El HTML se sanitiza contra XSS al guardar.
- **Propuestas**: temas, propuestas por tema y PDF del plan.
- **Galería**: subir varias fotos, reordenar, eliminar.
- **Testimonios, Estadísticas, Sobre mí, Mensajes**: gestión completa;
  los mensajes se marcan como leídos y se responden por WhatsApp.

## 5. Seguridad

- RLS: lectura pública solo de publicados; escritura solo autenticada.
- Sanitización con `sanitize-html` (servidor) en noticias, columnas y bio.
- Rate limiting en `/admin/login` (5 intentos / 10 min) + 2FA recomendado.
- Uploads validados: solo jpg/png/webp/avif y PDF, máx. 5 MB.
- Claves solo en `.env` (ignorado por git); publica `.env.example` sin secretos.

## 6. Deploy en Vercel

1. Sube el repo a GitHub.
2. En Vercel → *Add New Project* → importa el repo.
3. Agrega las **Environment Variables** de `.env.example`
   (usa la URL real en `NEXT_PUBLIC_SITE_URL`).
4. Deploy. Luego configura tu dominio y verifica `/sitemap.xml`.

Backup de contenido en cualquier momento:

```bash
npx tsx scripts/export-content.ts
```

## 7. Estructura

```
/app  home, noticias, columnas, galeria, propuestas, sobre-mi, contacto, admin/…
/components/public  Header, Footer, Hero, NewsCard, SearchBar, TestimonialCarousel, GalleryGrid, StatsBar, ContactForm, ProposalSection…
/components/admin   PostForm, RichTextEditor, Uploaders (Image/PDF)…
/lib  supabase/{client,server,middleware}, data.ts, sanitize.ts, utils.ts, constants.ts
/types  Post, Testimonial, GalleryImage, Stat, ProposalGroup, ContactMessage, SiteConfig
/supabase/migrations  001_schema, 002_rls_storage, 003_seed
/scripts  export-content.ts (backup JSON)
```
