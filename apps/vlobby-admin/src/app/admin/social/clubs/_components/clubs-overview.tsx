"use client";
import { PlusIcon } from "lucide-react";
import useSheetStore from "../../../../lib/global-state/sheet-state";
import { ClubIconPath } from "../../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";


export default function ClubsOverview() {
  const openSheet = useSheetStore((state) => state.openSheet);

  const handleOpenUserForm = () => {
    openSheet(
      "New Club",
      "Use the form below to invite a team memeber to your account. We will send them an invite and configure their credentials based on their role.",
    );
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 p-2">
      <div className="flex w-full flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <svg
              className="h-5 w-5 fill-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
            >
              {ClubIconPath()}
            </svg>
            <p className="text-lg text-foreground">Clubs</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Use this section of the settings to add and assign access to
            building or project staff. This could include contractors, property
            managers, or anyone who needs administrative control over the
            system.
          </p>
        </div>
        <Button
          className="gap-2"
          variant={"outline"}
          onClick={handleOpenUserForm}
        >
          <PlusIcon className="h-3 w-3" />
          <p className="text-sm text-foreground">New</p>
        </Button>
      </div>
    </div>
  );
}
