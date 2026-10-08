
import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth-guard";
import { ProfileForm } from "@/components/profile-form";
import { SteamSettings } from "@/components/steam-settings";

export const metadata: Metadata = {
  title: "My Profile",

  description:
    "Manage your GameBaseHQ account, profile information, connected Steam account and sharing preferences.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen w-full min-w-0 bg-slate-50">
        {/* PAGE HEADER */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Account
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Your Profile
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Manage your account,
              connected platforms,
              profile information and
              sharing preferences.
            </p>
          </div>
        </section>

        {/* ACCOUNT SETTINGS */}

        <div className="mx-auto w-full max-w-7xl min-w-0 space-y-8 px-5 py-10 sm:px-8">
          <SteamSettings />

          <ProfileForm />
        </div>
      </main>
    </AuthGuard>
  );
}
