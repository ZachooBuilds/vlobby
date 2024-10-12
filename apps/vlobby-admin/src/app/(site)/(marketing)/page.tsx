import { IconReceiptFilled } from '@tabler/icons-react';
import { AmbientColor } from '../_components/ambient-color';
import { Heading } from 'lucide-react';
import { CTA } from '../_components/cta';
import { Features } from '../_components/features';
import { FeatureIconContainer } from '../_components/features/feature-icon-container';
import { Hero } from '../_components/hero';
import { PricingGrid } from '../_components/pricing-grid';
import { Subheading } from '../_components/subheading';
import { Testimonials } from '../_components/testimonials';
import { Tools } from '../_components/tools';

export default function Home() {
  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <AmbientColor />
      <Hero />
      <Features />
      <Tools />
      {/*
      <Testimonials />
      <div className="py-20 sm:py-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceiptFilled className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="pt-4">Simple pricing</Heading>
        <Subheading>
          Simple pricing for startups, small businesses, medium scale businesses
          and enterprises.
        </Subheading>
        <PricingGrid />
      </div>
      <CTA /> */}
    </div>
  );
}
