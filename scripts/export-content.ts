// Saca copia de todo el contenido en un archivo JSON para guardar o mover a otro lado.
// Como se usa: poner las claves en el .env y correr npx tsx scripts/export-content.ts
// Genera un archivo backup-fecha.json con posts, fotos, testimonios, numeros, propuestas y mensajes.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("❌ Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const supabase = createClient(URL, KEY);
const destino = process.argv[2] ?? join(process.cwd(), "backups");
mkdirSync(destino, { recursive: true });

const tablas = [
  "posts",
  "gallery_images",
  "testimonials",
  "stats",
  "proposal_groups",
  "proposals",
  "site_config",
  "contact_messages",
] as const;

const backup: Record<string, unknown> = { exportado: new Date().toISOString() };

for (const t of tablas) {
  const { data, error } = await supabase.from(t).select("*").limit(5000);
  if (error) {
    console.error(`⚠️ ${t}: ${error.message}`);
    backup[t] = [];
  } else {
    backup[t] = data;
    console.log(`✅ ${t}: ${(data ?? []).length} filas`);
  }
}

const archivo = join(destino, `backup-${new Date().toISOString().slice(0, 10)}.json`);
writeFileSync(archivo, JSON.stringify(backup, null, 2), "utf8");
console.log(`\n💾 Backup guardado en ${archivo}`);
