"use client";

import { useState } from "react";

interface PartnerInquiryFormProps {
  /** Dropdown options for "I'm interested in" — passed from getOfferings() so
   *  the form never drifts from the offerings listed in content/offerings.json. */
  interests: string[];
  /** Shown as the fallback if a submission fails. */
  contactEmail: string;
}

type Status = "idle" | "submitting" | "success" | "error";

// Shared field/label styling, matching the Partners page's editorial look:
// square corners, hairline borders, and small uppercase tracked labels.
const FIELD_BASE =
  "w-full border border-border bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus-visible:border-primary";

const LABEL_BASE = "block text-[11px] font-medium uppercase tracking-[0.18em] text-muted";

export default function PartnerInquiryForm({ interests, contactEmail }: PartnerInquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      company: data.get("company"),
      email: data.get("email"),
      interest: data.get("interest"),
      message: data.get("message"),
      website: data.get("website"), // honeypot — real users leave this empty
    };

    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/partner-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // No card chrome here — PartnerInquiryCard already supplies the surrounding
  // panel, so this only replaces the form inside it.
  if (status === "success") {
    return (
      <div className="py-2 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
          className="mx-auto mb-4 h-8 w-8 text-primary"
        >
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-lg font-semibold tracking-tight text-ink">
          Thanks — we&apos;ve got your inquiry.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {/* TODO: verify response time with DSS leadership */}
          We&apos;ll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot: visually hidden, off the tab order; bots fill it, humans don't. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={LABEL_BASE}>
            Name <span className="text-primary">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={FIELD_BASE}
            placeholder="Jordan Lee"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className={LABEL_BASE}>
            Company <span className="text-primary">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            maxLength={120}
            autoComplete="organization"
            className={FIELD_BASE}
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={LABEL_BASE}>
            Work email <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={FIELD_BASE}
            placeholder="you@company.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="interest" className={LABEL_BASE}>
            I&apos;m interested in
          </label>
          <select
            id="interest"
            name="interest"
            defaultValue={interests[0] ?? ""}
            className={FIELD_BASE}
          >
            {interests.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={LABEL_BASE}>
          What can we help with? <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={4000}
          rows={4}
          className={`${FIELD_BASE} resize-y`}
          placeholder="Tell us a bit about the problem, timeline, or event you have in mind."
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm leading-relaxed text-primary">
          {error} You can also email us at{" "}
          <a href={`mailto:${contactEmail}`} className="font-medium underline underline-offset-2">
            {contactEmail}
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center justify-center gap-3 border-2 border-primary bg-primary px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-150 hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send inquiry"}
          <span
            aria-hidden="true"
            className="transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-1"
          >
            →
          </span>
        </button>
        <p className="text-xs text-muted">
          Prefer email?{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-primary underline underline-offset-2"
          >
            {contactEmail}
          </a>
        </p>
      </div>
    </form>
  );
}
