
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the terms and conditions for using GameBaseHQ.",
    alternates: {
    canonical: "/terms",
  },
};

const lastUpdated = "8 October 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Terms of Use
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Last updated: {lastUpdated}
        </p>

        <p className="mt-6 leading-8 text-slate-600">
          These Terms of Use govern your access
          to and use of GameBaseHQ. By using
          the platform, you agree to comply
          with these terms.
        </p>
      </header>

      <article className="space-y-10 text-sm leading-7 text-slate-600 sm:text-base">
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            1. About GameBaseHQ
          </h2>

          <p>
            GameBaseHQ is a game collection
            management platform that allows
            users to organise games, track
            progress, maintain wishlists and
            access related gaming features.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            2. User Accounts
          </h2>

          <p>
            Certain features require an account.
            You are responsible for maintaining
            the security of your account and
            ensuring that information you provide
            is accurate.
          </p>

          <p className="mt-3">
            You must not access another persons
            account without permission or use
            GameBaseHQ in a way that compromises
            the security of the platform.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            3. Acceptable Use
          </h2>

          <p>
            You agree not to:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              Use GameBaseHQ for unlawful purposes.
            </li>
            <li>
              Attempt to gain unauthorised access
              to accounts, systems or data.
            </li>
            <li>
              Interfere with the availability,
              performance or security of the service.
            </li>
            <li>
              Upload malicious code or harmful content.
            </li>
            <li>
              Scrape, overload or misuse our services
              in ways that disrupt normal operation.
            </li>
            <li>
              Infringe the intellectual property
              or privacy rights of others.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            4. Game Information and Artwork
          </h2>

          <p>
            GameBaseHQ may display game titles,
            descriptions, artwork and other
            information provided by third-party
            services, including IGDB.
          </p>

          <p className="mt-3">
            Game information may be incomplete,
            inaccurate or unavailable from time
            to time. GameBaseHQ does not claim
            ownership of third-party game
            artwork, trademarks or other
            protected materials.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            5. Third-Party Integrations
          </h2>

          <p>
            GameBaseHQ may integrate with services
            such as Steam and Google.
          </p>

          <p className="mt-3">
            Your use of those services is also
            subject to their respective terms,
            policies and availability.
          </p>

          <p className="mt-3">
            We may modify or discontinue
            integrations if access, functionality
            or third-party requirements change.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            6. Affiliate Links
          </h2>

          <p>
            Some links on GameBaseHQ may direct
            you to third-party retailers,
            including Amazon.
          </p>

          <p className="mt-3">
            GameBaseHQ may earn a commission
            from qualifying purchases made
            through affiliate links, at no
            additional cost to you.
          </p>

          <p className="mt-3">
            Purchases, payments, refunds,
            shipping and product support are
            handled by the relevant retailer,
            subject to their terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            7. User Content
          </h2>

          <p>
            You retain any rights you hold
            in content you submit, such as
            personal reviews, ratings and
            uploaded images.
          </p>

          <p className="mt-3">
            You grant GameBaseHQ permission
            to store, process and display
            that content as reasonably
            necessary to provide the
            features you use.
          </p>

          <p className="mt-3">
            You must have the necessary
            rights or permissions to
            upload and share content.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            8. Service Availability
          </h2>

          <p>
            We aim to keep GameBaseHQ available
            and functioning reliably, but
            do not guarantee uninterrupted
            access or error-free operation.
          </p>

          <p className="mt-3">
            Features may be updated,
            suspended or discontinued
            for maintenance, security
            or operational reasons.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            9. Disclaimer and Liability
          </h2>

          <p>
            GameBaseHQ is provided on an
            &apos;as available&apos; basis. To the
            extent permitted by applicable
            law, we do not guarantee the
            accuracy, availability or
            suitability of the service
            for every purpose.
          </p>

          <p className="mt-3">
            Nothing in these Terms excludes,
            restricts or modifies rights
            or remedies that cannot lawfully
            be excluded, including any
            applicable rights under
            Australian consumer law.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            10. Account Suspension or Termination
          </h2>

          <p>
            We may suspend or restrict
            access where reasonably
            necessary to address security
            concerns, unlawful activity
            or material breaches of
            these Terms.
          </p>

          <p className="mt-3">
            You may stop using GameBaseHQ
            and request account deletion
            through available account
            features or by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            11. Changes to These Terms
          </h2>

          <p>
            We may update these Terms
            from time to time. The
            current version will be
            published on this page.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            12. Contact
          </h2>

          <p>
            Questions about these Terms
            can be submitted through
            our{" "}
            <Link
              href="/contact"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Contact page
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
