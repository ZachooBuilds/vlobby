'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';

/**
 * LandingPage Component
 * 
 * This component represents the main landing page of the application.
 * It displays a background image, logo, and buttons for login and account creation.
 * 
 * @returns {JSX.Element} The rendered landing page
 */
export default function LandingPage() {
  return (
    <div
      className="flex flex-col gap-4 items-center
     justify-start
      min-h-screen w-full pt-[50px] pb-[20px] p-4"
    >
      {/* Background Image */}
      <motion.div
        className="flex flex-grow w-full relative rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/background.jpg"
          alt="Resolve Logo"
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          priority
        />
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            {/* Logo */}
            <Image
              src="/resolvelogo.png"
              alt="Resolve Logo"
              width={200}
              height={200}
              quality={100}
              priority
            />

            {/* Action Buttons */}
            <div className="flex flex-col w-full gap-4 mt-4">
              {/* Login Button */}
              <Link href="/sign-in" passHref>
                <Button className="w-full h-14">Login</Button>
              </Link>
              {/* Create Account Button */}
              <Link href="/sign-up" passHref>
                <Button className="w-full h-14" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Terms and Conditions */}
            <p className="text-muted-foreground text-xs text-center mt-4">
              By creating an account, you agree to our Terms and Conditions.
              Created by Virtual Lobby Technology LTD.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
