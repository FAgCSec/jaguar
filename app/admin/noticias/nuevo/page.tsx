import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "../../layout";
import { guardarPost } from "../../posts-actions";

export const metadata: Metadata = { title: "Nueva noticia" };

export default async function NuevaNoticia() {
  await requireAdmin();
  async function action(fd: FormData) {
    "use server";
    await guardarPost("noticia", null, fd);
  }
  return (
    <main>
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Nueva noticia</h1>
      <div className="mt-4">
        <PostForm tipo="noticia" action={action} />
      </div>
    </main>
  );
}
