"use client";

import { UserButton } from "@clerk/nextjs";
import { LogoPath } from "../lib/icons/icons";
import { ModeToggle } from "../admin/_components/global-components/dark-mode-toggle";

/**
 * OnboardingBar Component
 * 
 * This component renders the top bar for the onboarding process.
 * It displays the application logo and user controls.
 *
 * @returns {JSX.Element} The rendered OnboardingBar component
 */
export default function OnboardingBar() {
  return (
    <div className="flex w-full flex-row items-center justify-between pl-10 pr-10 pt-2">
      {/* Logo section */}
      <div>
        <svg className="h-16 w-28 fill-foreground">
          <LogoPath />
        </svg>
      </div>
      {/* User controls section */}
      <div className="flex flex-row items-center gap-2">
        {/* Theme toggle button */}
        <ModeToggle />
        {/* User profile button */}
        <UserButton />
      </div>
    </div>
  );
}
