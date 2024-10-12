
import { IconReceiptFilled } from "@tabler/icons-react";
import { Metadata } from "next";
import { AmbientColor } from "../../_components/ambient-color";
import { Heading } from "lucide-react";
import { CTA } from "../../_components/cta";
import { FeatureIconContainer } from "../../_components/features/feature-icon-container";
import { PricingGrid } from "../../_components/pricing-grid";
import { Subheading } from "../../_components/subheading";
import { TestimonialsMarquee } from "../../_components/testimonials/marquee";

export const metadata: Metadata = {
  title: "Pricing | Proactiv | Aceternity Templates",
  description:
    "Proactiv is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
  openGraph: {
    images: ["https://proactiv-aceternity.vercel.app/banner.png"],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* <AmbientColor />
      <div className="py-20 sm:py-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceiptFilled className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="mt-4">
          Simple pricing
        </Heading>
        <Subheading>
          Simple pricing for startups, small businesses, medium scale businesses
          and enterprises.
        </Subheading>
        <PricingGrid />
      </div>
      <div className="pb-40">
        <TestimonialsMarquee />
      </div>
      <CTA /> */}
    </div>
  );
}
