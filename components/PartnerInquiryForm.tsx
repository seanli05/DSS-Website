"use client";

import { useState, type FormEvent } from "react";

// TODO: replace the mailto handoff with a real endpoint (an /api route writing to
// Airtable, or a form service) once one exists. Composing a prefilled email is the
// only option that actually delivers a submission with no backend — a form that
// silently does nothing on submit would be worse than not shipping one.
const INBOX = "dss@berkeley.edu";

const FIELD_BASE =
  "w-full border border-border bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus-visible:border-primary";

const LABEL_BASE = "block text-[11px] font-medium uppercase tracking-[0.18em] text-muted";

export default function PartnerInquiryForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = `Partnership enquiry${company ? ` — ${company}` : ""}`;
    const body = [
      `Company: ${company}`,
      `Email: ${email}`,
      "",
      "Notes:",
      notes || "(none)",
    ].join("\n");
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email + Company share a row on wider layouts — Notes below is the only
          field long enough to need the full width to itself. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="partner-email" className={LABEL_BASE}>
            Email address
          </label>
          <input
            id="partner-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={FIELD_BASE}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="partner-company" className={LABEL_BASE}>
            Company
          </label>
          <input
            id="partner-company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className={FIELD_BASE}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="partner-notes" className={LABEL_BASE}>
          Additional notes
        </label>
        <textarea
          id="partner-notes"
          name="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What problem are you hoping to work on?"
          className={`${FIELD_BASE} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="group mt-1 inline-flex items-center justify-center gap-3 border-2 border-primary bg-primary px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-150 hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary"
      >
        Work with us
        <span
          aria-hidden="true"
          className="transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      {/* role="status" so the confirmation is announced without stealing focus. */}
      <p role="status" className="min-h-5 text-sm leading-relaxed text-muted">
        {sent
          ? `Thanks — we've opened an email to ${INBOX} with your details. Send it and we'll reply within a few days.`
          : ""}
      </p>
    </form>
  );
}
