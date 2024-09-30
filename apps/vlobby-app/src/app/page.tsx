'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@repo/ui/components/ui/card';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { LogoPath } from '../lib/images';
import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/clerk-react";

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/home');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-5">
      <Image
        src="/background.jpg"
        alt="Background"
        layout="fill"
        quality={100}
        priority
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="w-full max-w-md relative z-10 flex flex-col gap-2">
          <CardHeader className="p-2">
            <AspectRatio ratio={2 / 1}>
              <LogoPath />
            </AspectRatio>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full items-center p-2">
              <p className="text-lg font-semibold">
                {' '}
                👋 Hey, Lets get cracking ...
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/sign-up')}>
                Create Account
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/sign-in')}
              >
                Login
              </Button>
            </div>
            <p className="text-muted-foreground text-xs text-center">
              By creating an account, you agree to our Terms and Conditions.
              Created by Virtual Lobby TEchnology LTD.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
