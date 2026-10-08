
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how GameBaseHQ collects, uses and protects personal information.",
    alternates: {
    canonical: "/privacy",
  },
};

const lastUpdated = "8 October 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Last updated: {lastUpdated}
        </p>

        <p className="mt-6 leading-8 text-slate-600">
          GameBaseHQ respects your privacy. This Privacy
          Policy explains how information may be collected,
          used, stored and shared when you use our website
          and services.
        </p>
      </header>

      <article className="space-y-10 text-sm leading-7 text-slate-600 sm:text-base">
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            1. Information We Collect
          </h2>

          <p>
            Depending on how you use GameBaseHQ,
            we may collect:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              Account information, such as your email
              address and authentication identifiers.
            </li>
            <li>
              Profile information you choose to provide.
            </li>
            <li>
              Game library information, including
              saved games, ratings, statuses and wishlists.
            </li>
            <li>
              Steam account identifiers and supported
              game information when you connect Steam.
            </li>
            <li>
              Technical and usage information, such as
              page visits, browser information and
              interactions with website features.
            </li>
            <li>
              Messages or enquiries you choose to send us.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            2. How We Use Information
          </h2>

          <p>
            We use information where reasonably necessary
            to operate and improve GameBaseHQ, including to:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Create and manage user accounts.</li>
            <li>Save and display game collections.</li>
            <li>Provide library, wishlist and tracking features.</li>
            <li>Support optional Steam integration.</li>
            <li>Maintain security and investigate misuse.</li>
            <li>Understand website performance and usage.</li>
            <li>Respond to support enquiries.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            3. Authentication and Account Security
          </h2>

          <p>
            GameBaseHQ uses third-party authentication
            and database services, including Supabase,
            to support account creation, sign-in and
            information storage.
          </p>

          <p className="mt-3">
            If you sign in using Google, authentication
            information is processed as part of that
            sign-in process. GameBaseHQ does not receive
            your Google account password.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            4. Steam Integration
          </h2>

          <p>
            Connecting your Steam account is optional.
            When you choose to connect Steam, GameBaseHQ
            may access your Steam identifier, public
            profile information and supported game
            information through Steam services.
          </p>

          <p className="mt-3">
            The availability of Steam information depends
            on your Steam privacy settings and the
            information Steam makes available.
          </p>

          <p className="mt-3">
            Disconnecting Steam stops future access
            through that connection, but previously
            imported game information may remain in
            your GameBaseHQ library until removed.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            5. Third-Party Services
          </h2>

          <p>
            GameBaseHQ may use third-party services
            to operate its features, including:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Supabase for authentication and data storage.</li>
            <li>Vercel for website hosting and analytics.</li>
            <li>IGDB for game information and artwork.</li>
            <li>Steam for optional account and game integration.</li>
            <li>Google for optional account authentication.</li>
            <li>Amazon for affiliate product links.</li>
          </ul>

          <p className="mt-3">
            These providers may process information
            under their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            6. Analytics and Cookies
          </h2>

          <p>
            We may use analytics tools to understand
            how GameBaseHQ is used and identify areas
            for improvement.
          </p>

          <p className="mt-3">
            Authentication technologies, including
            cookies or similar browser storage, may
            be used to maintain your sign-in session
            and support website functionality.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            7. Data Storage and Security
          </h2>

          <p>
            We take reasonable steps to protect
            information against unauthorised access,
            misuse, loss and disclosure.
          </p>

          <p className="mt-3">
            However, no online service or method
            of electronic storage can be guaranteed
            to be completely secure.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            8. International Data Processing
          </h2>

          <p>
            Some third-party service providers may
            store or process information outside
            Australia. Where applicable, their
            infrastructure and privacy practices
            may be subject to overseas laws.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            9. Data Retention and Account Deletion
          </h2>

          <p>
            We retain information for as long as
            reasonably necessary to provide our
            services, comply with applicable
            obligations and address legitimate
            operational needs.
          </p>

          <p className="mt-3">
            You may request deletion of your account
            and associated information through
            available account features or by
            contacting us.
          </p>

          <p className="mt-3">
            Some information may remain temporarily
            in backups or be retained where required
            or permitted by law.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            10. Your Privacy Choices
          </h2>

          <p>
            You may contact us to request access
            to, correction of or deletion of
            personal information, subject to
            applicable law and reasonable
            verification requirements.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            11. Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy
            when our services, practices or
            legal obligations change. The
            latest version will be published
            on this page.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            12. Contact
          </h2>

          <p>
            For privacy questions or requests,
            please use our{" "}
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
