/**
 * WebNavigation Component
 * 
 * This component provides a responsive navigation menu for the admin interface.
 * It supports collapsible view, dynamic rendering of navigation items based on user permissions,
 * and integrates with Convex for real-time data and authentication.
 */

"use client";

// External library imports
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import Image from "next/image";

// Internal imports
import { api } from "@repo/backend/convex/_generated/api";
import { ImagePlaceholder, navigationItems } from "../../../lib/app-data/static-data";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@repo/ui/components/ui/command";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Card } from "@repo/ui/components/ui/card";
import { SettingIconPath } from "../../../lib/icons/icons";
import { Feature, IconImage } from "../../../lib/app-data/app-types";

// Type definitions
type Props = {
  sidebarLogo?: string;
};

/**
 * WebNavigation Component
 * 
 * @param {Props} props - The component props
 * @returns {JSX.Element} The navigation menu component
 */
export default function WebNavigation({ sidebarLogo }: Props) {
  // Authentication state from Convex
  const { isLoading, isAuthenticated } = useConvexAuth();
  
  // Current pathname for determining the selected navigation item
  const pathname = usePathname();

  // State to manage the collapsed view of the sidebar
  const [isCollapsed, setCollapsed] = useState(false);

  // Function to toggle the collapsed state of the sidebar
  const toggleView = () => setCollapsed(!isCollapsed);

  // Fetch features data from the Convex backend
  const featuresData = useQuery(api.features.getAllFeatures);

  // Fetch logo and icon images from the Convex backend
  const logoImage = useQuery(api.theme.getLogoImage) as IconImage;
  const iconImage = useQuery(api.theme.getIconImage) as IconImage;

  /**
   * Renders navigation items based on the provided category and user permissions
   * 
   * @param {string} category - The category of navigation items to render
   * @returns {JSX.Element[]} An array of rendered navigation items
   */
  const renderNavigationItems = (category: string) => {
    return navigationItems
      .filter((option) => option.category === category)
      .filter((option) => {
        // Check if the option is enabled based on fetched features
        return featuresData?.some(
          (feature: Feature) =>
            feature.enabled &&
            feature.feature.toLowerCase().includes(option.name.toLowerCase()),
        );
      })
      .map((option, index) => {
        const isSelected = pathname.includes(
          option.href.split("/")[1] ?? option.href,
        );
        return (
          <CommandItem
            key={index}
            className="w-full !bg-transparent hover:bg-slate-100"
          >
            <Link href={`/admin/${option.href}`} className="w-full text-start">
              <Button
                variant={isSelected ? "default" : "ghost"}
                className={cn("w-full", {
                  "justify-center": isCollapsed,
                  "justify-start": !isCollapsed,
                })}
              >
                <div className="flex flex-row items-center gap-2">
                  <div
                    className={cn("h-5 w-5", {
                      "fill-white": isSelected,
                      "fill-foreground": !isSelected,
                    })}
                  >
                    <option.icon />
                  </div>
                  {!isCollapsed && (
                    <p
                      className={cn("pl-2", {
                        "text-white": isSelected,
                        "text-foreground": !isSelected,
                      })}
                    >
                      {option.name}
                    </p>
                  )}
                </div>
              </Button>
            </Link>
          </CommandItem>
        );
      });
  };

  return (
    <Card
      className={cn("flex flex-col p-2", {
        "w-[80px]": isCollapsed,
        "w-[300px]": !isCollapsed,
      })}
    >
      {/* Toggle button for collapsing/expanding the sidebar */}
      <div
        className={cn("flex flex-row gap-2 pb-2", {
          "justify-center": isCollapsed,
          "justify-end": !isCollapsed,
        })}
      >
        <Button
          variant={"outline"}
          className="items-center justify-center p-2"
          onClick={toggleView}
        >
          {isCollapsed ? (
            <ChevronRight className="stroke-foreground" />
          ) : (
            <ChevronLeft className="stroke-foreground" />
          )}
        </Button>
      </div>

      {/* Logo or icon display based on collapsed state */}
      <div className="flex items-center justify-center ">
        <div
          className={cn("fill-foreground pt-2", {
            "h-10 w-10": isCollapsed,
            "h-28 w-48": !isCollapsed,
          })}
        >
          {!isCollapsed ? (
            <Image
              src={logoImage?.url ?? ImagePlaceholder}
              alt="Page not found"
              className="h-full w-full rounded-sm object-contain object-center p-5"
              width={300}
              height={300}
              unoptimized
            />
          ) : (
            <Image
              src={iconImage?.url ?? ImagePlaceholder}
              alt="Page not found"
              className="h-full w-full rounded-sm object-contain object-center"
              width={50}
              height={50}
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex flex-grow flex-col overflow-hidden pb-4">
        <Command>
          {!isCollapsed && (
            <div className="rounded-sm bg-muted">
              <CommandInput placeholder="Search..." />
            </div>
          )}
          <CommandList className="py-4">
            <CommandEmpty>No Results Found</CommandEmpty>
            <CommandGroup heading={!isCollapsed && "Quick Actions"}>
              {renderNavigationItems("quick_actions")}
            </CommandGroup>
            {!isCollapsed && (
              <>
                <CommandGroup heading="Maintainence">
                  {renderNavigationItems("maintainence")}
                </CommandGroup>
                <CommandGroup heading="Site Info">
                  {renderNavigationItems("site_details")}
                </CommandGroup>
                <CommandGroup heading="Resident Services">
                  {renderNavigationItems("resident_services")}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </div>

      {/* Account & Settings button (visible only in expanded view) */}
      {!isCollapsed && (
        <Link href={`/admin/settings/general`}>
          <Button variant={"secondary"} className="flex w-full flex-row gap-2">
            <svg
              className="h-4 w-4 fill-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
            >
              <SettingIconPath />
            </svg>
            Account & Settings
          </Button>
        </Link>
      )}
    </Card>
  );
}
