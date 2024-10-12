
import { Metadata } from "next";
import { AmbientColor } from "../../_components/ambient-color";
import { CTA } from "../../_components/cta";
import { Features } from "../../_components/features";
import { FeaturesGrid } from "../../_components/features/features-grid";
import { Testimonials } from "../../_components/testimonials";
import { Tools } from "../../_components/tools";

export const metadata: Metadata = {
  title: "Features | Proactiv | Aceternity Templates",
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
      <Tools />
      <Features />
      <FeaturesGrid />

      <div className="pb-40">
        <Testimonials />
      </div>
      <CTA /> */}
    </div>
  );
}
