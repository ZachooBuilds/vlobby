import { ReactNode } from "react";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Badge } from "@tremor/react";
import { UnderConstructionImage } from "../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";

interface NoDataProps {
  badgeText: string;
  title: string;
  description: string;
  buttonText?: string;
  formComponent?: ReactNode;
  sheetTitle?: string;
  sheetDescription?: string;
}

export default function NoData({
  badgeText,
  title,
  description,
  buttonText,
  formComponent,
  sheetTitle,
  sheetDescription,
}: NoDataProps) {
  const { openSheet } = useSheetStore();

  const handleButtonClick = () => {
    if (sheetTitle && sheetDescription && formComponent) {
      openSheet(sheetTitle, sheetDescription, formComponent);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="space-y-4 text-center">
        <Badge>{badgeText}</Badge>
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-lg md:text-xl">
          {title}
        </h1>
        <p className="max-w-[600px] text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <UnderConstructionImage />

      {buttonText && formComponent && sheetTitle && sheetDescription && (
        <Button variant="secondary" onClick={handleButtonClick}>
          {buttonText}
        </Button>
      )}
      {/* <GlobalSheet /> */}
    </div>
  );
}
