'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import Image from 'next/image';
import { Container } from './container';
import { Heading } from './heading';
import { Subheading } from './subheading';
import { Button } from '@repo/ui/components/ui/button';

export const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col h-full py-20"
    >
      <Container className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-28 gap-4">
          <Heading
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl font-semibold"
          >
            Transform Your Building with VLobby.
          </Heading>
          <Subheading className="text-lg md:text-xl text-muted-foreground">
            Streamline Operations, Enhance Resident Experience, and Optimize
            Building Management with Our Comprehensive Property Solution
          </Subheading>
          <Button className="flex items-center space-x-2 text-lg text-white">
            <span>Book a demo</span>
            <HiArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Container>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full max-w-6xl mx-auto mt-16 px-4"
      >
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/dash-new.png"
            alt="VLobby Dashboard"
            width={1400}
            height={720}
            className="w-full h-auto"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
