-- ============================================================
-- Datos de ejemplo para que el sitio no se vea vacio al inicio.
-- Borrar desde el /admin cuando ya haya contenido real.
-- Se ejecuta de ultimo, despues del 001 y 002.
-- ============================================================

-- Noticias de ejemplo
insert into public.posts (tipo, titulo, slug, extracto, contenido, imagen_url, categoria, estado, published_at)
values
  ('noticia', 'Recorrimos 5 municipios escuchando a las comunidades',
   'recorrimos-5-municipios-escuchando-comunidades',
   'El candidato visitó veredas y cascos urbanos para recoger propuestas de campesinos, jóvenes y comerciantes.',
   '<p>Iniciamos el recorrido por el departamento visitando <strong>cinco municipios</strong> en una semana. Escuchamos a campesinos, madres cabeza de hogar, jóvenes y comerciantes.</p><blockquote>“El gobierno debe nacer del territorio, no del escritorio.”</blockquote><p>Las principales peticiones fueron <strong>vías rurales</strong>, agua potable y apoyo al campo.</p><ul><li>Mejoramiento de vías terciarias</li><li>Agua potable veredal</li><li>Crédito justo para el campo</li></ul>',
   null, 'Territorio', 'publicado', now() - interval '2 days'),
  ('noticia', 'Propuesta de educación rural gratuita y de calidad',
   'propuesta-educacion-rural-gratuita',
   'Transporte escolar, alimentación y conectividad para que ningún niño se quede sin estudiar.',
   '<p>Presentamos nuestro compromiso con la <strong>educación rural</strong>: transporte escolar digno, alimentación caliente y conectividad en cada sede.</p><p>Porque educar en el campo también es sembrar futuro.</p>',
   null, 'Propuestas', 'publicado', now() - interval '5 days'),
  ('noticia', 'Gran encuentro de voluntarios en la sede de campaña',
   'gran-encuentro-voluntarios-sede',
   'Más de 200 voluntarios se sumaron a la campaña en una jornada de alegría y compromiso.',
   '<p>Más de <strong>200 voluntarios</strong> se sumaron este fin de semana. Gracias a cada municipio que llegó con banderas, música y esperanza.</p>',
   null, 'Campaña', 'publicado', now() - interval '8 days')
on conflict (slug) do nothing;

-- Columnas de opinión de ejemplo
insert into public.posts (tipo, titulo, slug, extracto, contenido, imagen_url, categoria, estado, published_at)
values
  ('columna', 'La selva no se rinde: carta a mi departamento',
   'la-selva-no-se-rinde-carta',
   'Por qué creo en un gobierno campesino, honesto y cercano a la gente.',
   '<p>Queridos paisanos: escribo esta carta desde una vereda, con los pies en la tierra. Creo en un gobierno <strong>campesino y honesto</strong>, que escuche antes de prometer.</p><blockquote>“Gobernar es servir, no servirse.”</blockquote><p>Nuestra selva nos enseñó a resistir y a florecer. Esa es la política que propongo.</p>',
   null, 'Editorial', 'publicado', now() - interval '3 days'),
  ('columna', 'El campo merece precios justos',
   'el-campo-merece-precios-justos',
   'Sin intermediarios abusivos: centros de acopio y vías para vender mejor.',
   '<p>El campesino madruga, siembra y cosecha, pero el precio se lo pone otro. Propongo <strong>centros de acopio</strong>, vías terciarias y compras públicas directas al campo.</p>',
   null, 'Campo', 'publicado', now() - interval '10 days')
on conflict (slug) do nothing;

-- Estadísticas del hero
insert into public.stats (etiqueta, valor, icono, orden) values
  ('Municipios visitados', '32', 'map', 1),
  ('Propuestas del plan', '48', 'doc', 2),
  ('Voluntarios activos', '1200+', 'users', 3),
  ('Veredas escuchadas', '150', 'leaf', 4)
on conflict do nothing;

-- Testimonios
insert into public.testimonials (nombre, municipio, foto_url, texto, orden) values
  ('María González', 'San José', null, 'Es un hombre de palabra. Lo vimos caminar las veredas cuando nadie más venía.', 1),
  ('Pedro Ramírez', 'El Retorno', null, 'Apoya al campesino de verdad. Por eso mi familia lo respalda.', 2),
  ('Lucía Fernández', 'Calamar', null, 'Una campaña alegre, sin ataques, solo propuestas. Eso nos gusta.', 3)
on conflict do nothing;

-- Grupos de propuestas + propuestas
do $$
declare g1 uuid; g2 uuid; g3 uuid;
begin
  if not exists (select 1 from public.proposal_groups) then
    insert into public.proposal_groups (tema, orden) values
      ('Campo y selva productiva', 1),
      ('Salud y educación digna', 2),
      ('Vías, agua y energía', 3)
    returning id into g1;
    -- recuperar ids en orden
    select id into g1 from public.proposal_groups where tema = 'Campo y selva productiva';
    select id into g2 from public.proposal_groups where tema = 'Salud y educación digna';
    select id into g3 from public.proposal_groups where tema = 'Vías, agua y energía';

    insert into public.proposals (group_id, titulo, descripcion, orden) values
      (g1, 'Precios justos para el campesino', 'Centros de acopio, compras públicas directas y control a intermediarios.', 1),
      (g1, 'Crédito barato y asistencia técnica', 'Convenios con banca pública y extensionistas en cada municipio.', 2),
      (g2, 'Salud rural con brigadas móviles', 'Brigadas médicas mensuales y telemedicina en puestos de salud.', 1),
      (g2, 'Educación con transporte y alimentación', 'Rutas escolares dignas, PAE caliente y conectividad total.', 2),
      (g3, 'Vías terciarias transitables', 'Maquinaria amarilla por subregiones y convites comunitarios.', 1),
      (g3, 'Agua potable veredal', 'Acueductos comunitarios y plantas de tratamiento donde falten.', 2);
  end if;
end $$;

-- Config del sitio
insert into public.site_config (id, eslogan, sobre_mi)
  values (1, 'La selva florece con trabajo honesto',
    '<p>Soy un hijo de esta tierra. Nací y crecí entre ríos y selva, y conozco el esfuerzo del campesino porque lo viví. He trabajado por las comunidades desde joven y hoy quiero servir como gobernador.</p>')
  on conflict (id) do update set
    eslogan = excluded.eslogan,
    sobre_mi = coalesce(public.site_config.sobre_mi, excluded.sobre_mi);

-- Galería de ejemplo (sin imágenes reales: el admin las sube)
insert into public.gallery_images (url, titulo, orden) values
  ('https://picsum.photos/seed/selva1/800/600', 'Recorrido por el río', 1),
  ('https://picsum.photos/seed/selva2/800/600', 'Encuentro campesino', 2),
  ('https://picsum.photos/seed/selva3/800/600', 'Voluntarios', 3)
on conflict do nothing;
