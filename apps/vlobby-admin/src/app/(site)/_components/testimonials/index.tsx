"use client";
import React from "react";
import { TestimonialsSlider } from "./slider";
import { FeatureIconContainer } from "../features/feature-icon-container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { TbLocationBolt } from "react-icons/tb";
import { cn } from '@repo/ui/lib/utils';
import { TestimonialsGrid } from "./grid";
import { AmbientColor } from "../ambient-color";

export const Testimonials = () => {
  return (
    <div className="relative">
      <AmbientColor />
      <div className="pb-20">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <TbLocationBolt className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="pt-4">Used by entreprenurs</Heading>
        <Subheading>
          Proactiv is used by serial entrepreneurs and overachievers.
        </Subheading>
      </div>

      <div className="py-60 relative">
        <div className="absolute inset-0 h-full w-full bg-charcoal opacity-30 [mask-image:radial-gradient(circle_at_center,transparent_10%,white_90%)]">
          <TestimonialsGrid />
        </div>
        <TestimonialsSlider />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-charcoal to-transparent"></div>
    </div>
  );
};
