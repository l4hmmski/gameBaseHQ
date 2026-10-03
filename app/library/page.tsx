import { GameCard } from "@/components/game-card";

const games = [
  {
    id: 1,
    title: "The Witcher 3",
    platform: "PlayStation 5",
    status: "Completed",
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    platform: "PC",
    status: "Playing",
  },
  {
    id: 3,
    title: "The Legend of Zelda",
    platform: "Nintendo Switch",
    status: "Backlog",
  },
  {
    id: 4,
    title: "Red Dead Redemption 2",
    platform: "Xbox Series X",
    status: "Completed",
  },
];

export default function LibraryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="font-semibold text-blue-600">
          Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          My Game Library
        </h1>

        <p className="mt-3 text-black-600">
          Browse the games in your collection.
        </p>
      </div>

      <section
        className="
          grid gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            platform={game.platform}
            status={game.status}
          />
        ))}
      </section>
    </main>
  );
}