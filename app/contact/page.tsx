
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GameBaseHQ for support, account enquiries, feedback and privacy requests.",
    alternates: {
    canonical: "/contact",
  },
};

const contactEmail = "support@gamebasehq.app";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Get in Touch
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Contact Us
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Have a question, found a bug or
          have an idea for GameBaseHQ?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">
          Email Support
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          For general enquiries, technical
          issues, account support or feedback,
          you can contact us at:
        </p>

        <a
          href={`mailto:${contactEmail}`}
          className="mt-5 inline-block break-all text-lg font-bold text-indigo-600 hover:underline"
        >
          {contactEmail}
        </a>

        <div className="mt-7">
          <a
            href={`mailto:${contactEmail}?subject=GameBaseHQ%20Enquiry`}
            className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Send an Email
          </a>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Technical Support
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Experiencing a problem with your
            library, account or Steam connection?
            Include a description of the issue
            and any relevant error messages.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Privacy & Account Requests
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Contact us for questions about
            your personal information,
            account access or deletion requests.
          </p>
        </div>
      </div>
    </main>
  );
}
