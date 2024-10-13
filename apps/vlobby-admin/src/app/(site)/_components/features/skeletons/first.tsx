'use client';
import { motion } from 'framer-motion';

import React from 'react';
import Image from 'next/image';
import { IconContainer } from '../icon-container';
import {
  DormakabaIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MetaIcon,
  SaltoIcon,
  SlackIcon,
  TiktokIcon,
  TwitterIcon,
} from '../../icons/illustrations';

export const SkeletonOne = () => {
  return (
    <div className="p-8 overflow-hidden h-full">
      <div className="flex flex-col gap-4 items-center justify-center h-full relative">
        <div className="flex gap-4 items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="62"
            height="105"
            viewBox="0 0 62 105"
            fill="none"
            className="absolute left-1/2 -translate-x-[60px]  -top-10 text-primary"
          >
            <path
              d="M1.00001 -69L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <motion.path
              d="M1.00001 -69L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105"
              stroke="url(#gradient-1)"
              strokeWidth="1.5"
            />
            <defs>
              <motion.linearGradient
                initial={{
                  x1: '0%',
                  y1: '0%',
                  x2: '0%',
                  y2: '0%',
                }}
                animate={{
                  x1: '100%',
                  y1: '90%',
                  x2: '120%',
                  y2: '120%',
                }}
                id="gradient-1"
                transition={{
                  duration: Math.random() * (7 - 2) + 2,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                <stop stopColor="#001AFF" stopOpacity={`0`} />
                <stop offset="1" stopColor="#6DD4F5" />
                <stop offset="1" stopColor="#6DD4F5" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
          <svg
            width="128"
            height="69"
            viewBox="0 0 128 69"
            fill="none"
            className="absolute left-1/2 translate-x-4  -bottom-2 text-primary"
          >
            <path
              d="M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 75"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <motion.path
              d="M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 75"
              stroke="url(#gradient-2)"
              strokeWidth="1.5"
            />

            <defs>
              <motion.linearGradient
                initial={{
                  x1: '0%',
                  y1: '0%',
                  x2: '0%',
                  y2: '0%',
                }}
                animate={{
                  x1: '100%',
                  y1: '90%',
                  x2: '120%',
                  y2: '120%',
                }}
                id="gradient-2"
                transition={{
                  duration: Math.random() * (7 - 2) + 2,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                <stop stopColor="#001AFF" stopOpacity={`0`} />
                <stop offset="1" stopColor="#6DD4F5" />
                <stop offset="1" stopColor="#6DD4F5" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>

          <IconContainer>
            <Image
              src="/access-logos/1.svg"
              alt="Logo 1"
              width={40}
              height={40}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/2.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/3.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/4.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/5.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/6.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/7.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
        </div>
        <div className="flex gap-4 items-center justify-center flex-shrink-0 ml-8">
          <IconContainer>
            <Image
              src="/access-logos/7.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/6.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/5.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/4.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/3.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/2.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
          <IconContainer>
            <Image
              src="/access-logos/1.svg"
              alt="Logo 1"
              width={32}
              height={32}
            />
          </IconContainer>
        </div>
      </div>
    </div>
  );
};