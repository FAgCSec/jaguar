import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "../../layout";
import { guardarPost } from "../../posts-actions";
import type { Post } from "@/types";

// Editar una columna existente. Si el id no es de tipo columna, muestra 404.
export default async function EditarColumna({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("*").eq("id", id).eq("tipo", "columna").single();
  const post = data as Post | null;
  if (!post) notFound();

  async function action(fd: FormData) {
    "use server";
    await guardarPost("columna", id, fd);
  }
  return (
    <main>
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Editar columna</h1>
      <div className="mt-4">
        <PostForm tipo="columna" post={post} action={action} />
      </div>
    </main>
  );
}
