import Airtable from "airtable";
import { NextResponse } from "next/server";

// Runtime endpoint for the Partners page lead form. Writes one row per inquiry
// to Airtable so officers read leads directly in the base — no third-party tool.
// Secrets stay server-side (never imported into a client component); this file
// is the only place the write token is read. Because it runs at request time,
// the site can't be exported as pure static HTML — that's fine on Vercel, but
// if DSS ever moves to OCF/GitHub Pages this would need a third-party form
// endpoint (e.g. Formspree) instead.

export const runtime = "nodejs";

// Keep in sync with the form's `maxLength` attributes. A hard server-side cap so
// a malicious client can't push megabytes into the Airtable base.
const LIMITS = { name: 120, company: 120, email: 200, interest: 120, message: 4000 };

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Deliberately loose — just enough to reject obvious junk without bouncing valid
// but unusual addresses. Real validation is "did they get our reply".
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a hidden field real users never fill. Pretend success so bots get
  // no signal, but write nothing.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, LIMITS.name);
  const company = str(body.company, LIMITS.company);
  const email = str(body.email, LIMITS.email);
  const interest = str(body.interest, LIMITS.interest);
  const message = str(body.message, LIMITS.message);

  if (!name || !company || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, company, email, and message." },
      { status: 400 }
    );
  }
  if (!looksLikeEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, PARTNER_INQUIRIES_TABLE } = process.env;
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !PARTNER_INQUIRIES_TABLE) {
    // Not configured (e.g. local dev without secrets). Don't pretend it worked —
    // the form surfaces the email fallback on a failed submit.
    console.error("partner-inquiry: Airtable env vars not configured; inquiry not saved.");
    return NextResponse.json(
      { ok: false, error: "Our inquiry form isn't available right now." },
      { status: 503 }
    );
  }

  try {
    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);
    // typecast: let Airtable create the single-select "Interest" option on the
    // fly, so a new offering doesn't require editing the base's field options.
    await base(PARTNER_INQUIRIES_TABLE).create(
      [
        {
          fields: {
            Name: name,
            Company: company,
            Email: email,
            Interest: interest || "Not specified",
            Message: message,
          },
        },
      ],
      { typecast: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("partner-inquiry: Airtable write failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong saving your inquiry." },
      { status: 502 }
    );
  }
}
