import { requireAdmin } from "../layout";
import { SobreMiForm } from "./SobreMiForm";

export default async function AdminSobreMi() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_config").select("*").eq("id", 1).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (data as any) ?? {};

  return (
    <main>
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Sobre mí y portada</h1>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">
        Edita el eslogan, la biografía, tu foto y la imagen del hero.
      </p>
      <div className="mt-4">
        <SobreMiForm
          inicial={{
            eslogan: c.eslogan ?? "",
            sobre_mi: c.sobre_mi ?? "",
            foto: c.sobre_mi_foto_url ?? "",
            hero: c.hero_imagen_url ?? "",
          }}
        />
      </div>
    </main>
  );
}
