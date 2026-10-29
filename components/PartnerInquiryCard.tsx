import { getOfferings, partnersPage } from "@/lib/content";
import { site } from "@/lib/site";
import PartnerInquiryForm from "./PartnerInquiryForm";

// Copy: `inquiryForm` in content/partners/page.json. The fallback address shown
// when a submission fails is `partnersEmail` in content/site.json.
const copy = partnersPage.inquiryForm;

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
      <Heading className="text-xl font-semibold tracking-tight text-ink">{copy.heading}</Heading>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-muted">{copy.subtext}</p>
      <PartnerInquiryForm
        interests={interests}
        contactEmail={site.partnersEmail}
        successHeading={copy.successHeading}
        successBody={copy.successBody}
      />
    </div>
  );
}
