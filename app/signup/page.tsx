import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main
      className="
        flex min-h-[calc(100vh-73px)]
        items-center justify-center
        px-6 py-12
      "
    >
      <SignupForm />
    </main>
  );
}