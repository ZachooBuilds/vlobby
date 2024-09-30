"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { socialMenu } from "../../../lib/app-data/static-data";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { cn } from "@repo/ui/lib/utils";

/**
 * SocialNavigation Component
 *
 * This component renders a navigation bar for the social section of the admin panel.
 * It uses tabs to display different social features like announcements, feed, and clubs.
 *
 * Usage:
 * <SocialNavigation />
 *
 * How it recognizes tabs:
 * 1. The component uses the `usePathname` hook to get the current URL path.
 * 2. It then compares this path with the `href` property of each item in the `socialMenu` array.
 * 3. The matching menu item is set as the selected tab.
 *
 * How to add new tabs:
 * 1. Add a new object to the `socialMenu` array in the `src/lib/data.ts` file.
 * 2. The new object should have properties: `name`, `href`, and `icon`.
 * 3. Ensure the `href` matches the route for the new tab's page.
 * 4. The component will automatically render the new tab in the navigation.
 */
export default function SocialNavigation() {
  const pathname = usePathname();

  const selectedMenuItem =
    socialMenu.find((option) => pathname.includes(option.href)) ??
    socialMenu[0]!;

  return (
    <Tabs value={selectedMenuItem.name}>
      <TabsList className="flex flex-row bg-background">
        {socialMenu.map((step) => (
          <Link key={step.name} href={step.href}>
            <TabsTrigger value={step.name}>
              <div className="flex flex-row items-center gap-2">
                <div
                  className={cn("h-4 w-4", {
                    "fill-muted": step.name === selectedMenuItem.name,
                    "fill-foreground": step.name !== selectedMenuItem.name,
                  })}
                >
                  <step.icon />
                </div>
                {step.name}
              </div>
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
