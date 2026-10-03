import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white text-white">
      <nav
        className="
          mx-auto flex max-w-6xl
          items-center justify-between
          px-6 py-4
        "
      >
        <Link
          href="/"
          className="text-xl font-bold text-black"
        >
          Game Library
        </Link>

        <div className="flex gap-6">
          <Link
            href="/"
            className="hover:text-blue-600 text-black"
          >
            Home
          </Link>

          <Link
            href="/library"
            className="hover:text-blue-600 text-black"
          >
            Library
          </Link>

          <Link
            href="/profile"
            className="hover:text-blue-600 text-black"
          >
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}