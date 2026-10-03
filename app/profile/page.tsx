import { AuthGuard } from "@/components/auth-guard";
import { ProfileItem } from "@/components/profile-item";

const profile = {
  displayName: "Liam",
  favouritePlatform: "PlayStation 5",
  gamesCollected: "0",
  currentGame: "None selected",
};

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main
        className="
          mx-auto max-w-3xl
          px-6 py-12
        "
      >
        <p className="font-semibold text-blue-700">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Profile
        </h1>

        <p className="mt-3 text-gray-800">
          Your game collection information.
        </p>

        <section
          className="
            mt-8 rounded-xl border
            border-gray-300 bg-white
            px-6 text-gray-950
            shadow-sm
          "
        >
          <ProfileItem
            label="Display name"
            value={
              profile.displayName
            }
          />

          <ProfileItem
            label="Favourite platform"
            value={
              profile.favouritePlatform
            }
          />

          <ProfileItem
            label="Games collected"
            value={
              profile.gamesCollected
            }
          />

          <ProfileItem
            label="Currently playing"
            value={
              profile.currentGame
            }
          />
        </section>
      </main>
    </AuthGuard>
  );
}