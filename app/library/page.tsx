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

        <p className="mt-3 text-gray-600">
          These games are temporary sample
          data for now.
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
          <article
            key={game.id}
            className="
              rounded-xl border
              border-gray-200 bg-white
              p-6 shadow-sm
            "
          >
            <h2 className="text-xl font-bold">
              {game.title}
            </h2>

            <p className="mt-3 text-gray-600">
              Platform: {game.platform}
            </p>

            <p className="mt-1 text-gray-600">
              Status: {game.status}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}