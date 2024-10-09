"use client";

import * as React from "react";
import { MoonStar } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";

/**
 * ModeToggle Component
 * 
 * This component provides a dropdown menu for toggling between different theme modes.
 * It uses the next-themes library to manage theme changes.
 *
 * @returns {JSX.Element} A dropdown menu for theme selection
 */
export function ModeToggle() {
  // Use the setTheme function from next-themes to change the current theme
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* Trigger button for the dropdown menu */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoonStar className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* Dropdown menu content */}
      <DropdownMenuContent align="end">
        {/* Menu item for Light theme */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        {/* Menu item for Dark theme */}
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        {/* Menu item for System theme (follows system preferences) */}
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
