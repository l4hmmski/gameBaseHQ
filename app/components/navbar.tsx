import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-green-500 text-white">
      <nav
        className="
          mx-auto flex max-w-6xl
          items-center justify-between
          px-6 py-4
        "
      >
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Game Library
        </Link>

        <div className="flex gap-6">
          <Link
            href="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/library"
            className="hover:text-blue-600"
          >
            Library
          </Link>

          <Link
            href="/profile"
            className="hover:text-blue-600"
          >
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}