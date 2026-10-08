
import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Log In",

  description:
    "Log in to GameBaseHQ to manage your game library, wishlist, gaming statistics and connected accounts.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] w-full min-w-0 items-center justify-center bg-slate-50 px-5 py-12 sm:px-6">
      <div className="w-full min-w-0 max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
