"use client";

import { Sheet, SheetContent, SheetFooter } from "@repo/ui/components/ui/sheet";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { CardDescription, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

/**
 * GlobalSheet Component
 * 
 * This component provides a reusable sheet (side panel) for the application.
 * It uses the useSheetStore hook to manage the sheet's state and content.
 *
 * @returns {JSX.Element} A sheet component with dynamic content
 */
export function GlobalSheet() {
  // Destructure the necessary state and functions from the sheet store
  const { isOpen, formComponent, closeSheet, title, description } =
    useSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="mx-2 mt-2 max-h-[98vh] overflow-y-auto rounded-lg !border-none bg-background p-4 shadow-lg sm:w-full md:max-w-[60vw]">
        {/* Header section with title and description */}
        <div className="flex flex-col gap-2">
          <CardTitle className="text-foreground">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {/* Content section for dynamic form component */}
        <div className="py-4">{formComponent}</div>
        {/* Footer section with close button */}
        <SheetFooter>
          <Button type="submit" onClick={closeSheet} className="text-white">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
