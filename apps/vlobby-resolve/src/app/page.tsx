'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@repo/ui/components/ui/card';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { LogoPath } from '../lib/images';
import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/maintenance');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-5">
      <Image
        src="/background2.jpg"
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
          <CardHeader className="pt-8 flex justify-center items-center">
            <Image
              src="/resolvelogo.jpg"
              alt="Resolve Logo"
              width={200}
              height={200}
              quality={100}
              priority
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full items-center p-2">
              <p className="text-lg font-semibold">
                {' '}
                Hey, Lets get these issues sorted.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/sign-up" passHref>
                <Button className="w-full">Create Account</Button>
              </Link>
              <Link href="/sign-in" passHref>
                <Button variant="secondary" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground text-xs text-center">
              By creating an account, you agree to our Terms and Conditions.
              Created by Virtual Lobby Technology LTD.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
