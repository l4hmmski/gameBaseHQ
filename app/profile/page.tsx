import { AuthGuard } from "@/components/auth-guard";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main
        className="
          mx-auto max-w-5xl
          px-6 py-12
        "
      >
        <p className="font-semibold text-blue-700">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Your Profile
        </h1>

        <p className="mt-3 text-gray-800">
          Manage your account and game
          collection information.
        </p>

        <div className="mt-8">
          <ProfileForm />
        </div>
      </main>
    </AuthGuard>
  );
}