"use client";

import { PlusIcon } from "lucide-react";
import { FormType, IconName } from "../../../lib/app-data/app-types";
import useSheetStore from "../../../lib/global-state/sheet-state";
import useModalStore from "../../../lib/global-state/modal-state";
import { FormMap, IconMap } from "../../../lib/app-data/static-data";
import { Button } from "@repo/ui/components/ui/button";


/**
 * SectionHeader Component
 *
 * This component renders a header section for different parts of the application.
 * It displays a title, description, icon, and a button that can open a sheet with additional content.
 *
 * Usage Guide:
 * <SectionHeader
 *   title="Section Title"
 *   description="Section description goes here"
 *   icon="IconName"
 *   buttonText="Add New"
 *   sheetTitle="Sheet Title"
 *   sheetDescription="Sheet description"
 *   sheetContent="FormComponentName"
 * />
 *
 * Note: Ensure that the icon name and form component name are defined in IconMap and FormMap respectively.
 */

type SectionHeaderProps = {
  title: string;
  description: string;
  icon: IconName;
  buttonText: string;
  sheetTitle: string;
  sheetDescription: string;
  sheetContent?: FormType;
  isModal?: boolean;
};

export default function SectionHeader({
  title,
  description,
  icon,
  buttonText,
  sheetTitle,
  sheetDescription,
  sheetContent,
  isModal,
}: SectionHeaderProps) {
  // Access the openSheet function from the global sheet store
  const openSheet = useSheetStore((state) => state.openSheet);
  const openModal = useModalStore((state) => state.openModal);
  // Dynamically get the icon component based on the icon prop
  const IconComponent = IconMap[icon];
  // Get the sheet content component if provided, otherwise null
  const SheetContent = sheetContent ? FormMap[sheetContent] : null;

  // Handle the button click to open the sheet
  const handleButtonClick = () => {
    if (SheetContent) {
      if (isModal) {
        openModal(sheetTitle, sheetDescription, <SheetContent />);
      } else {
        openSheet(sheetTitle, sheetDescription, <SheetContent />);
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 p-2">
      <div className="flex w-full flex-row items-start justify-between gap-4">
        {/* Left side: Title, Icon, and Description */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 w-5 fill-foreground">
              <IconComponent />
            </div>
            <p className={`text-foreground ${isModal ? "text-sm" : "text-lg"}`}>
              {title}
            </p>
          </div>
          <p className="min-h-8 text-xs text-muted-foreground">{description}</p>
        </div>
        {/* Right side: Action Button */}
        <Button
          className="gap-2"
          variant={"outline"}
          onClick={handleButtonClick}
          disabled={!sheetContent}
        >
          <PlusIcon className="h-3 w-3" />
          <p className="text-sm text-foreground">{buttonText}</p>
        </Button>
      </div>
    </div>
  );
}
