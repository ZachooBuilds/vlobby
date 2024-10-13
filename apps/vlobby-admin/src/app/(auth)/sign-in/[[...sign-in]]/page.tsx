'use client';
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Sign In Page Component
 *
 * This component renders the sign-in page for the application.
 * It utilizes the SignIn component from Clerk for authentication.
 *
 * @returns {JSX.Element} The sign-in page with centered Clerk SignIn component
 */
export default function Page() {

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/**
       * SignIn component from Clerk
       * Renders the sign-in form and handles authentication
       * The path prop specifies the route for the sign-in page
       */}
      <SignIn path="/sign-in" />
    </div>
  );
}
