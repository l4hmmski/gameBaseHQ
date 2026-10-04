export default function TermsPage() {
  return (
    <main className="bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Terms of Use
          </h1>

          <p className="mt-4 text-slate-500">
            Last updated: October 2026
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            These Terms of Use explain the
            rules that apply when using
            Game Library.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-black text-slate-950">
                1. Acceptance of these terms
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                By creating an account or
                using Game Library, you
                agree to use the service in
                accordance with these Terms
                of Use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                2. Your account
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                You are responsible for
                maintaining the security of
                your account and for the
                information entered through
                your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                3. Acceptable use
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Game Library must not be
                used to interfere with the
                operation of the service,
                gain unauthorised access to
                other accounts or systems,
                upload malicious material
                or use the service for
                unlawful purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                4. Game information and artwork
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Game names, artwork,
                trademarks and related
                information may belong to
                their respective publishers,
                developers and other rights
                holders. Third-party game
                information may be supplied
                through services such as
                IGDB.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                5. Third-party services
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Some Game Library features
                depend on third-party
                providers. Availability,
                accuracy and operation of
                those services may be
                outside the control of Game
                Library.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                6. Service availability
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Game Library may change,
                suspend or discontinue
                features from time to time.
                Continuous or uninterrupted
                availability of the service
                is not guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                7. Limitation of liability
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Game Library is provided
                on an as-available basis.
                To the extent permitted by
                applicable law, Game
                Library is not responsible
                for losses resulting from
                interruptions, inaccurate
                third-party information or
                loss of data outside its
                reasonable control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                8. Changes to these terms
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                These terms may be updated
                as the service develops.
                Continued use of Game
                Library after updated terms
                are published may constitute
                acceptance of those updated
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950">
                9. Contact
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Questions about these Terms
                of Use can be submitted
                through the Contact page.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}