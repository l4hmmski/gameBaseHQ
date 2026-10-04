import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Need some help?
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Have a question, found a
            problem or want to provide
            feedback about Game Library?
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              ?
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-950">
              Support
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              If something is not working
              correctly, include as much
              information as possible about
              what happened and what you
              were trying to do.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              +
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-950">
              Feedback
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Suggestions for new features
              and improvements are welcome
              as Game Library continues to
              develop.
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Contact details
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            A dedicated support email
            address will be added here
            before Game Library is publicly
            launched.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Do not add your personal email
            address here unless you are
            comfortable making it public.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}