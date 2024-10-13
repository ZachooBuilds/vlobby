'use client';
import { motion, stagger, animate, useAnimate } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { IconContainer } from '../icon-container';
import { cn } from '@repo/ui/lib/utils';
import { SparklesCore } from '../../ui/sparkles';
import { TbRazorElectric, TbTemperatureCelsius } from 'react-icons/tb';
import { BsLightningChargeFill, BsMoisture } from 'react-icons/bs';
import { FaHouseFloodWater, FaWater } from 'react-icons/fa6';

export const SkeletonThree = () => {
  const [animating, setAnimating] = useState(false);

  const scale = [1, 1.1, 1];
  const transform = ['translateY(0px)', 'translateY(-4px)', 'translateY(0px)'];
  const sequence = [
    [
      '.circle-1',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-2',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-3',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-4',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-5',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    // @ts-ignore
    animate(sequence, {
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <TbTemperatureCelsius />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <BsMoisture />
        </Container>
        <Container className="circle-3">
          <BsLightningChargeFill />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <FaWater />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <FaHouseFloodWater />
        </Container>
      </div>

      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-secondary to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};