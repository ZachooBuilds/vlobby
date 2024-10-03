"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

/**
 * ConvexClientProvider Component
 * 
 * This component sets up the authentication and Convex client providers for the application.
 * It wraps the entire app to provide authentication and real-time data capabilities.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be wrapped by the providers
 * @returns {JSX.Element} The wrapped application with Clerk and Convex providers
 */
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    console.log("Convex URL:", process.env.NEXT_PUBLIC_CONVEX_URL);
  }, []);

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        variables: {
          /**
           * Set the primary color for Clerk's UI components.
           * This should match your application's theme.
           * The value is in HSL format for better color manipulation.
           */
          colorPrimary: 'hsl(248.4, 100%, 60.6%)',
        },
      }}
    >
      {/**
       * ConvexProviderWithClerk integrates Convex with Clerk authentication.
       * It uses the Convex client and Clerk's useAuth hook to manage authentication state.
       */}
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}