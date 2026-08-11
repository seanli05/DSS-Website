import { getOfferings } from "@/lib/content";
import PartnerInquiryForm from "./PartnerInquiryForm";

// TODO: confirm the inquiry inbox with DSS leadership — matches the "Email us"
// link in the footer.
const CONTACT_EMAIL = "dss@berkeley.edu";

interface PartnerInquiryCardProps {
  className?: string;
  /**
   * "h2" in the hero, where nothing else on the page outranks it. "h3" when the
   * card is reused inside a block that already has its own h2 (the closing
   * panel), so the heading order stays properly nested instead of jumping back
   * up a level.
   */
  headingLevel?: "h2" | "h3";
}

/**
 * The "Get in touch" form card — shared between the hero (beside the headline)
 * and the closing panel (standalone, centered) so the two don't drift apart as
 * separate copies of the same markup.
 */
export default function PartnerInquiryCard({
  className = "",
  headingLevel = "h2",
}: PartnerInquiryCardProps) {
  const Heading = headingLevel;
  // Server Component: the offerings are read here rather than at each call site,
  // so the two usages on the Partners page stay a plain <PartnerInquiryCard />.
  const interests = getOfferings().map((offering) => offering.title);
  return (
    <div className={`bg-bg p-6 shadow-card md:p-8 ${className}`}>
      <Heading className="text-xl font-semibold tracking-tight text-ink">Get in touch</Heading>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-muted">
        Tell us a little about your company and what you&apos;d like to work on.
      </p>
      <PartnerInquiryForm interests={interests} contactEmail={CONTACT_EMAIL} />
    </div>
  );
}
