"use client";
import { PlusIcon } from "lucide-react";
import { ReactNode } from "react";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Badge } from "@tremor/react";
import { Button } from "@repo/ui/components/ui/button";

interface DetailsHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  badges?: string[];
  editButtonLabel?: string;
  FormComponent: ReactNode;
  sheetTitle?: string;
  sheetDescription?: string;
}

export default function DetailsHeader({
  title,
  description,
  icon,
  badges = [],
  editButtonLabel = "Edit Details",
  FormComponent,
  sheetTitle = "Edit Details",
  sheetDescription = "Use the form below to edit the details.",
}: DetailsHeaderProps) {
  const openSheet = useSheetStore((state) => state.openSheet);

  const handleOpenForm = () => {
    openSheet(sheetTitle, sheetDescription, FormComponent);
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 p-2">
      <div className="flex w-full flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-4">
            <div className="h-4 w-4">{icon}</div>

            <p className="text-lg text-foreground">{title}</p>
            {badges.map((badge, index) => (
              <Badge
                key={index}
              >
                {badge}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Button className="gap-2" variant={"outline"} onClick={handleOpenForm}>
          <PlusIcon className="h-3 w-3" />
          <p className="text-sm text-foreground">{editButtonLabel}</p>
        </Button>
      </div>
    </div>
  );
}
