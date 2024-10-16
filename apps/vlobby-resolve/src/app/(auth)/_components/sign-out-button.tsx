'use client';

import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Button } from '@repo/ui/components/ui/button';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Redirect to the landing page after sign out
  };

  return (
    <Button onClick={handleSignOut} variant="outline" className="w-full h-14">
      Sign Out
    </Button>
  );
}
