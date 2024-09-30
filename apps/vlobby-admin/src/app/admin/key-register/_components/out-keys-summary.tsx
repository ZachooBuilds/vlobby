"use client";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { Badge } from "@tremor/react";
import { useMutation } from "convex/react";
import { OutKeysSummaryData } from "../../../lib/app-data/app-types";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { toast } from "@repo/ui/hooks/use-toast";
import { KeyIconPath } from "../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";

interface OutKeysSummaryProps {
  outKeys: OutKeysSummaryData[];
}

export default function OutKeysSummary({ outKeys }: OutKeysSummaryProps) {
  const setKeyReturned = useMutation(api.keys.handleKeyReturned);

  const handleKeyReturned = async (keyId: string) => {
    try {
      await setKeyReturned({
        _id: keyId as Id<"keyLogs">,
        checkinTime: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Key returned successfully",
      });
    } catch (error) {
      console.error("Error setting key returned:", error);
      toast({
        title: "Error",
        description: "Failed to return key",
        variant: "destructive",
      });
    }
    console.log("Key Returned:", keyId);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-3">
      {outKeys?.map((option, index) => (
        <div
          key={index}
          className="flex h-full flex-col  justify-between gap-2 rounded-md border border-muted p-2 hover:shadow-sm"
        >
          <div className="flex items-start gap-4 p-4">
            <div className="flex items-center justify-center rounded-lg bg-slate-100 p-1">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
              >
                {KeyIconPath()}
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <Badge size="xs">{option.spaceName}</Badge>
                <Badge size="xs" color="purple">
                  {option.keyTypeName}
                </Badge>
              </div>
              <div className="text-sm font-semibold">{option.userName}</div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <p className="font-semibold">Checkout Time:</p>
                <div className="flex items-center gap-2">
                  <MoveUpRight className="h-3 w-3" />
                  <span>{new Date(option.checkoutTime).toLocaleString()}</span>
                </div>
                <p className="font-semibold"> Expected Return Time:</p>
                <div className="flex items-center gap-2">
                  <MoveDownLeft className="h-3 w-3" />
                  <span>
                    {option.expectedCheckinTime
                      ? new Date(option.expectedCheckinTime).toLocaleString()
                      : "Not Set"}
                  </span>
                </div>

                <p className="font-semibold">Checked out to:</p>
                <div className="flex items-center gap-2">
                  <span>{option.connectedUser}</span>
                </div>
                <Badge size="xs" color="green">
                  {" "}
                  {option.userType}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => handleKeyReturned(option._id!)}
          >
            Key Returned
          </Button>
        </div>
      ))}
    </div>
  );
}
