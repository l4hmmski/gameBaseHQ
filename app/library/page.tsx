import { AuthGuard } from "@/components/auth-guard";
import { GameLibrary } from "@/components/game-library";

export default function LibraryPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Personal collection
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Game library
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Keep track of the games
              you own, what you are
              currently playing and
              what you have completed.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <GameLibrary />
        </div>
      </main>
    </AuthGuard>
  );
}