import { ProfileItem } from "@/components/profile-item";

const profile = {
  displayName: "Liam",
  favouritePlatform: "PlayStation 5",
  gamesCollected: "4",
  currentGame: "Cyberpunk 2077",
};

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-semibold text-blue-600">
        Account
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Profile
      </h1>

      <p className="mt-3 text-white">
        Your game collection information.
      </p>

      <section
        className="
          mt-8 rounded-xl border
          border-gray-200 bg-white
          px-6 shadow-sm
        "
      >
        <ProfileItem
          label="Display name"
          value={profile.displayName}
        />

        <ProfileItem
          label="Favourite platform"
          value={profile.favouritePlatform}
        />

        <ProfileItem
          label="Games collected"
          value={profile.gamesCollected}
        />

        <ProfileItem
          label="Currently playing"
          value={profile.currentGame}
        />
      </section>
    </main>
  );
}