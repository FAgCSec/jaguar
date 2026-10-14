import type {
  GalleryImage,
  Post,
  ProposalGroup,
  SiteConfig,
  Stat,
  Testimonial,
} from "@/types";

/** Datos de ejemplo en memoria: activar con NEXT_PUBLIC_MOCK_DATA=1 (borrar después). */
export const MOCK = process.env.NEXT_PUBLIC_MOCK_DATA === "1";

function haceDias(dias: number): string {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
}

function cuerpo(tema: string): string {
  return [
    `<p>En el marco de nuestra campaña recorrimos el territorio para escuchar a la comunidad. En <strong>${tema}</strong> confirmamos que las prioridades de la gente son claras y que un gobierno honesto nace del diálogo.</p>`,
    `<blockquote>“La política debe estar al servicio del campo y de la gente sencilla.”</blockquote>`,
    `<p>Los compromisos de esta visita:</p>`,
    `<ul><li>Obras que sí se pueden ejecutar desde el primer año</li><li>Transparencia total en la inversión pública</li><li>Participación de las comunidades en las decisiones</li></ul>`,
    `<p>Seguiremos caminando cada vereda, porque <strong>la selva florece con trabajo honesto</strong>.</p>`,
  ].join("");
}

const CATEGORIAS = ["Campaña", "Territorio", "Propuestas", "Comunidad", "Prensa"];

const NOTICIAS: [string, string][] = [
  ["Recorrido por la vereda La Esperanza", "Visitamos cascos urbanos y veredas para escuchar las prioridades de la comunidad."],
  ["Jóvenes de la campaña se reúnen en la plaza", "Más de 80 jóvenes organizaron la jornada de voluntarios del fin de semana."],
  ["Entrega de plantines en el corregimiento El RobLE", "Jornada ambiental con las comunidades y las escuelas del corregimiento."],
  ["Mesa de trabajo con líderes comunales", "Liderazgo social y de mujeres discutieron las obras priorizadas del municipio."],
  ["Jornada de limpieza del río principal", "Familias, escuelas y la campaña se unieron por el cuidado del agua."],
  ["Reunión con comerciantes del centro", "El comercio local propuso medidas concretas para reactivar la economía."],
  ["La caravana llegó a cinco municipios", "Tres días de recorrido con paradas en cada casco urbano del recorrido."],
  ["Taller de liderazgo para mujeres rurales", "Mujeres lideresas del territorio participaron en el taller de formación política."],
  ["Donación de útiles escolares en la sede", "Estudiantes de las sedes rurales recibieron su kit escolar completo."],
];

const COLUMNAS: [string, string][] = [
  ["Por un campo con precios justos", "Sin intermediarios abusivos: centros de acopio y compras públicas directas al campesino."],
  ["La educación rural no puede esperar", "Transporte escolar digno, alimentación y conectividad en cada sede rural."],
  ["Gobernar es escuchar antes de prometer", "Un gobierno nace del territorio, no del escritorio: la experiencia de esta campaña."],
  ["La selva nos enseña a resistir", "Lecciones del campo para una política honesta y con arraigo comunitario."],
];

function armarPosts(
  tipo: Post["tipo"],
  filas: [string, string][],
  prefijoSlug: string,
  diasBase: number[],
): Post[] {
  return filas.map(([titulo, extracto], i) => ({
    id: `preview-${tipo}-${i + 1}`,
    tipo,
    titulo: `[PREVIEW] ${titulo}`,
    slug: `${prefijoSlug}-${i + 1}`,
    extracto,
    contenido: cuerpo(titulo),
    imagen_url:
      tipo === "noticia" && i % 3 === 0
        ? `https://picsum.photos/seed/preview-${tipo}${i}/1200/675`
        : null,
    categoria: CATEGORIAS[i % CATEGORIAS.length],
    estado: "publicado",
    created_at: haceDias(diasBase[i] + 1),
    published_at: haceDias(diasBase[i]),
  }));
}

export const MOCK_POSTS: Post[] = [
  ...armarPosts(
    "noticia",
    NOTICIAS,
    "preview-noticia",
    [1, 2, 3, 5, 8, 11, 14, 18, 22],
  ),
  ...armarPosts("columna", COLUMNAS, "preview-columna", [2, 4, 10, 16]),
];

export const MOCK_STATS: Stat[] = [
  { id: "s1", etiqueta: "Municipios visitados", valor: "24", icono: "map", orden: 1 },
  { id: "s2", etiqueta: "Propuestas del plan", valor: "36", icono: "doc", orden: 2 },
  { id: "s3", etiqueta: "Voluntarios activos", valor: "850", icono: "users", orden: 3 },
  { id: "s4", etiqueta: "Fotos con el Jaguar", valor: "128", icono: "camera", orden: 4 },
];

export const MOCK_GALERIA: GalleryImage[] = Array.from({ length: 8 }, (_, i) => ({
  id: `preview-gal-${i + 1}`,
  url: `https://picsum.photos/seed/preview-gal${i}/800/600`,
  titulo: `[PREVIEW] Foto de campaña ${i + 1}`,
  orden: i + 1,
  created_at: haceDias(i),
}));

export const MOCK_TESTIMONIOS: Testimonial[] = [
  { id: "t1", nombre: "Ana Pérez", municipio: "San José", foto_url: null, texto: "Caminó nuestras veredas cuando nadie más venía. Eso no se olvida.", orden: 1 },
  { id: "t2", nombre: "Luis Gómez", municipio: "El Retorno", foto_url: null, texto: "Apoya al campesino de verdad. Por eso mi familia lo respalda.", orden: 2 },
  { id: "t3", nombre: "Carmen Díaz", municipio: "Calamar", foto_url: null, texto: "Una campaña alegre, sin ataques, solo propuestas. Eso nos gusta.", orden: 3 },
  { id: "t4", nombre: "Jorge Ruiz", municipio: "Puerto Nuevo", foto_url: null, texto: "Prometió la vía del corregimiento y ya tiene el plan claro.", orden: 4 },
  { id: "t5", nombre: "Marta Silva", municipio: "La Esperanza", foto_url: null, texto: "Escuchó a las mujeres del territorio con respeto y tiempo de sobra.", orden: 5 },
  { id: "t6", nombre: "Pedro Ramírez", municipio: "El Retorno", foto_url: null, texto: "El puente de la vereda por fin tiene fecha. Eso es compromiso.", orden: 6 },
  { id: "t7", nombre: "Lucía Fernández", municipio: "Calamar", foto_url: null, texto: "Una campaña alegre y con propuestas claras para el campo.", orden: 7 },
];

export const MOCK_GRUPOS: ProposalGroup[] = [
  {
    id: "g1",
    tema: "[PREVIEW] Desarrollo rural",
    orden: 1,
    proposals: [
      { id: "p1", group_id: "g1", titulo: "Precios justos para el campesino", descripcion: "Centros de acopio, compras públicas directas y control a intermediarios.", orden: 1 },
      { id: "p2", group_id: "g1", titulo: "Crédito barato y asistencia técnica", descripcion: "Convenios con banca pública y extensionistas en cada municipio.", orden: 2 },
    ],
  },
  {
    id: "g2",
    tema: "[PREVIEW] Educación y salud dignas",
    orden: 2,
    proposals: [
      { id: "p3", group_id: "g2", titulo: "Transporte escolar digno", descripcion: "Rutas seguras y alimentación caliente en las sedes rurales.", orden: 1 },
      { id: "p4", group_id: "g2", titulo: "Brigadas médicas móviles", descripcion: "Atención mensual y telemedicina en veredas y corregimientos.", orden: 2 },
    ],
  },
  {
    id: "g3",
    tema: "[PREVIEW] Vías, agua y energía",
    orden: 3,
    proposals: [
      { id: "p5", group_id: "g3", titulo: "Vías terciarias transitables", descripcion: "Maquinaria amarilla y convites comunitarios por subregiones.", orden: 1 },
      { id: "p6", group_id: "g3", titulo: "Agua potable veredal", descripcion: "Acueductos comunitarios y plantas de tratamiento donde falten.", orden: 2 },
      { id: "p7", group_id: "g3", titulo: "Energía firme para el campo", descripcion: "Saneamiento de conexiones y apoyo a proyectos solares rurales.", orden: 3 },
    ],
  },
];

export const MOCK_CONFIG: SiteConfig = {
  id: 1,
  eslogan: "La selva florece con trabajo honesto",
  sobre_mi:
    "<p>[PREVIEW] Soy un hijo de esta tierra. Nací y crecí entre ríos y selva, y conozco el esfuerzo del campesino porque lo viví. He trabajado por las comunidades desde joven y hoy quiero servir como gobernador.</p><p>Recorrí el territorio escuchando a las familias, y de esa escucha nació este plan de gobierno con obras concretas, transparencia y participación.</p>",
  sobre_mi_foto_url: null,
  pdf_plan_url: null,
  hero_imagen_url: null,
  updated_at: haceDias(0),
};
