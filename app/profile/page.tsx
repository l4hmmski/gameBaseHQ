export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-semibold text-blue-600">
        Account
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Profile
      </h1>

      <section
        className="
          mt-8 rounded-xl border
          border-gray-200 bg-white
          p-6 shadow-sm
        "
      >
        <div>
          <p className="text-sm text-gray-500">
            Display name
          </p>

          <p className="mt-1 font-semibold">
            Liam
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Favourite platform
          </p>

          <p className="mt-1 font-semibold">
            PlayStation 5
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Games collected
          </p>

          <p className="mt-1 font-semibold">
            3
          </p>
        </div>
      </section>
    </main>
  );
}