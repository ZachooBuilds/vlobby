import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

/**
 * RootLayout Component for Onboarding
 * 
 * This component serves as the layout wrapper for the onboarding process.
 * It checks if the user has completed onboarding and redirects if necessary.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered layout or redirects to dashboard if onboarding is complete
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if onboarding is complete using Clerk's auth session claims
  if (auth().sessionClaims?.metadata.onboardingComplete === true) {
    // Redirect to the dashboard if onboarding is complete
    redirect("/admin/dashboard");
  }

  // Render children if onboarding is not complete
  return <>{children}</>;
}
