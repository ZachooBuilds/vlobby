'use client';
import { motion, useMotionValueEvent } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { FeatureIconContainer } from './features/feature-icon-container';
import { Heading } from './heading';
import { Subheading } from './subheading';
import { StickyScroll } from './ui/sticky-scroll';
import {
  IconMailForward,
  IconSocial,
  IconTerminal,
  IconTool,
} from '@tabler/icons-react';
import { useScroll } from 'framer-motion';
import { BlurImage } from './blur-image';

export const Tools = () => {
  const content = [
    {
      icon: <IconMailForward className="h-8 w-8 text-muted-foreground" />,
      title: 'Smart Device Management',
      description:
        'Effortlessly control and monitor all smart devices across your property from a single, intuitive dashboard.',
      content: (
        <ImageContainer>
          <BlurImage
            src="/dashboard-nw.png"
            alt="Smart Device Management Dashboard"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
    {
      icon: <IconSocial className="h-8 w-8 text-secondary" />,
      title: 'Resident Communication',
      description:
        'Foster a sense of community with our integrated chat system, allowing easy communication between residents and management.',
      content: (
        <ImageContainer>
          <BlurImage
            src="/chat.png"
            alt="Resident Communication Interface"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
    {
      icon: <IconSocial className="h-8 w-8 text-secondary" />,
      title: 'Amenity Booking System',
      description:
        'Streamline the process of reserving shared spaces and amenities with our user-friendly booking platform.',
      content: (
        <ImageContainer>
          <BlurImage
            src="/booking.png"
            alt="Amenity Booking System"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
    {
      icon: <IconTerminal className="h-8 w-8 text-secondary" />,
      title: 'Space Management',
      description:
        'Efficiently manage and monitor all areas of your property, from individual units to common spaces.',
      content: (
        <ImageContainer>
          <BlurImage
            src="/space.png"
            alt="Space Management Overview"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
    {
      icon: <IconTerminal className="h-8 w-8 text-secondary" />,
      title: 'Detailed Space Analytics',
      description:
        'Gain deep insights into space utilization and resident preferences with our comprehensive analytics tools.',
      content: (
        <ImageContainer>
          <BlurImage
            src="/space-details.png"
            alt="Detailed Space Analytics Dashboard"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const backgrounds = [
    'var(--charcoal)',
    'var(--neutral-900)',
    'var(--gray-900)',
  ];
  const index = Math.round(scrollYProgress.get() * (backgrounds.length - 1));

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / content.length);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc]!)) {
          return index;
        }
        return acc;
      },
      0
    );
    setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
  });
  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-20 md:pt-40"
    >
      <div className="px-6">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconTool className="h-6 w-6 text-primary" />
        </FeatureIconContainer>
        <Heading className="mt-4">
          Comprehensive Building Management Tools
        </Heading>
        <Subheading className="text-foreground">
          VLobby provides a suite of powerful tools designed to streamline your
          property management tasks and enhance resident experiences.
        </Subheading>
      </div>
      <StickyScroll content={content} />
    </motion.div>
  );
};

const ImageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg relative shadow-2xl">
      {children}
      <div className="absolute bottom-0 w-full h-px inset-x-0 bg-gradient-to-r from-transparent via-secondary to-transparent" />
      <div className="absolute bottom-0 w-40 mx-auto h-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </div>
  );
};
