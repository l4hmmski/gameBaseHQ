import {
  ForgotPasswordForm,
} from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
      <ForgotPasswordForm />
    </main>
  );
}