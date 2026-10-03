import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="
        mx-auto flex min-h-[calc(100vh-73px)]
        max-w-6xl items-center
        px-6 py-16
      "
    >
      <section className="max-w-2xl">
        <p
          className="
            mb-4 font-semibold
            text-blue-600
          "
        >
          Your personal collection
        </p>

        <h1
          className="
            text-5xl font-bold
            tracking-tight
          "
        >
          Keep track of every game you own.
        </h1>

        <p
          className="
            mt-6 text-lg leading-8
            text-white
          "
        >
          Organise your games, track which
          platform they belong to and record
          what you are currently playing.
        </p>

        <Link
          href="/library"
          className="
            mt-8 inline-block rounded-lg
            bg-blue-600 px-5 py-3
            font-semibold text-white
            hover:bg-blue-700
          "
        >
          View my library
        </Link>
      </section>
    </main>
  );
}