"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  OrganizationSwitcher,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { ModeToggle } from "../global-components/dark-mode-toggle";

/**
 * PageBar Component
 * 
 * This component provides navigation and user interface elements for the application header.
 * It adapts its content based on the current route and user's organization.
 *
 * @returns {JSX.Element} The rendered PageBar component
 */
const PageBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Extract meaningful path segments for conditional rendering
  const pathSegments = pathname.split("/").filter(Boolean);
  const organization = useOrganization();

  return (
    <div className="flex w-full flex-row items-center justify-between p-2">
      {/* Left side: Contextual navigation or organization name */}
      {pathSegments.length >= 3 ? (
        // For deeper pages, provide a way to navigate back
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        // For top-level pages, display the organization name or default app name
        <div>{organization.organization?.name ?? "VLobby"}</div>
      )}
      {/* Right side: User controls and preferences */}
      <div className="flex flex-row items-center gap-2">
        {/* Allow users to toggle between light and dark mode */}
        <ModeToggle />
        {/* User authentication and profile management */}
        <UserButton afterSwitchSessionUrl="/" />
        {/* Enable switching between different organizations */}
        <div className="rounded-lg bg-muted p-1">
          <OrganizationSwitcher
            hidePersonal={true}
            afterSelectOrganizationUrl={"/admin/dashboard"}
            afterCreateOrganizationUrl={"/admin/dashboard"}
          />
        </div>
      </div>
    </div>
  );
};

export default PageBar;
