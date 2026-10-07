import {
  ResetPasswordForm,
} from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
      <ResetPasswordForm />
    </main>
  );
}