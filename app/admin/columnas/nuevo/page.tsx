import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "../../layout";
import { guardarPost } from "../../posts-actions";

export default async function NuevaColumna() {
  await requireAdmin();
  async function action(fd: FormData) {
    "use server";
    await guardarPost("columna", null, fd);
  }
  return (
    <main>
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Nueva columna</h1>
      <div className="mt-4">
        <PostForm tipo="columna" action={action} />
      </div>
    </main>
  );
}
