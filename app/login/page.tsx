import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main
      className="
        flex min-h-[calc(100vh-73px)]
        items-center justify-center
        px-6 py-12
      "
    >
      <LoginForm />
    </main>
  );
}