'use client';

import React, { useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation';
import { SignOutButton } from '../(auth)/_components/sign-out-button';

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">
          Hello, {user.firstName || user.username}!
        </h1>
        <SignOutButton />  
      </div>
    </div>
  );
}
