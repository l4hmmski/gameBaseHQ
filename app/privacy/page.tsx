export default function PrivacyPage() {
  return (
    <main className="bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-slate-500">
            Last updated: October 2026
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            This Privacy Policy explains
            what information may be
            collected when you use Game
            Library and how that information
            may be used.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-black text-slate-950">
                1. Information we collect
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                When you create an account,
                Game Library may store
                information such as your
                email address, username,
                display name, profile
                information and the games
                that you add to your
                library.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                2. Account information
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Account authentication and
                database services may be
                provided using Supabase.
                Authentication information
                is used to identify your
                account and protect access
                to your personal game
                library.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                3. Game library information
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Information about games
                added to your library may
                include game titles,
                platforms, playing status
                and associated cover image
                URLs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                4. Third-party services
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Game Library may use
                third-party services to
                provide certain features.
                This may include Supabase
                for authentication and data
                storage and IGDB for video
                game information and
                artwork.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                5. How information is used
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Information collected by
                Game Library is used to
                operate the service,
                maintain user accounts,
                display personal game
                libraries and provide the
                features available within
                the application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                6. Data security
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Reasonable steps are taken
                to protect information
                stored through Game Library.
                However, no online service
                or method of electronic
                storage can guarantee
                complete security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                7. Changes to this policy
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                This Privacy Policy may be
                updated as Game Library
                develops or new features
                and services are introduced.
                The date at the top of this
                page will be updated when
                significant changes are
                made.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                8. Contact
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Questions regarding this
                Privacy Policy can be
                submitted through the
                Contact page.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}