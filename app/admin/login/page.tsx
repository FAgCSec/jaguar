import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Acceso admin" };

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md content-center px-4 py-10">
      <LoginForm />
    </main>
  );
}
