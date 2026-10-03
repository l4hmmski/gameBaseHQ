import { AuthGuard } from "@/components/auth-guard";
import { GameLibrary } from "@/components/game-library";

export default function LibraryPage() {
  return (
    <AuthGuard>
      <main
        className="
          mx-auto max-w-6xl
          px-6 py-12
        "
      >
        <div className="mb-8">
          <p className="font-semibold text-blue-700">
            Collection
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            My Game Library
          </h1>

          <p className="mt-3 text-gray-800">
            Add, search, filter and organise
            your games.
          </p>
        </div>

        <GameLibrary />
      </main>
    </AuthGuard>
  );
}