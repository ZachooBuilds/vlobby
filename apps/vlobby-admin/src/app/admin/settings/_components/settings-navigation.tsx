// Use client-side rendering for this component
"use client";

import Link from "next/link"; // Next.js Link component for client-side navigation
// IMPORTS

import { usePathname } from "next/navigation"; // Hook to get the current pathname
import { settingsMenu } from "../../../lib/app-data/static-data";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";

// COMPONENT - Main component function
export default function SettingsNavigation() {
  // Get the current pathname using the usePathname hook from Next.js
  const pathname = usePathname();

  // Find the menu item whose href matches part of the current pathname
  // If no match is found, default to the first item in the settings menu
  const selectedMenuItem =
    settingsMenu.find((option) => pathname.includes(option.href)) ??
    settingsMenu[0]!;

  // Render the navigation tabs
  return (
    <Tabs value={selectedMenuItem.name} className="flex">
      {/* TabsList container with custom styling */}
      <TabsList className="flex flex-row bg-background">
        {/* Map over the settingsMenu array to render each tab */}
        {settingsMenu.map((step) => (
          // Use Next.js Link for client-side navigation. Key is required for list items.
          <Link key={step.name} href={step.href}>
            {/* TabsTrigger is a clickable element that changes the selected tab */}
            <TabsTrigger value={step.name}>{step.name}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
