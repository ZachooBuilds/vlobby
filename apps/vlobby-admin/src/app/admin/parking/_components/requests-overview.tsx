"use client";
import NewRequestForm from "../_forms/new-pickup-request";
import NewDropoffRequestForm from "../_forms/new-dropoff-request";
import { useQuery, useMutation } from "convex/react";
import { Badge } from "@tremor/react";
import { RequestCardData } from "../../../lib/app-data/app-types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { OccupantsIconPath, SpacesIconPath } from "../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { api } from "@repo/backend/convex/_generated/api";
import { useToast } from "@repo/ui/hooks/use-toast";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";

const RequestCard = ({
  request,
  onAssign,
  onComplete,
}: {
  request: RequestCardData;
  onAssign: (id: string) => void;
  onComplete: (id: string) => void;
}) => (
  <Card key={request._id} className="flex flex-col gap-1 p-2">
    <CardHeader className="flex flex-row items-center justify-between p-0">
      <Badge>
        {request.requestType
          .replace(":", "- ")
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Badge>
      <Badge
        size="xs"
        color={
          request.status === "received"
            ? "red"
            : request.status === "assigned"
              ? "orange"
              : "green"
        }
      >
        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
      </Badge>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 p-2">
      <div>
        <p className="font-medium">{request.vehicleDetails}</p>
      </div>
      <div className="flex flex-row items-center gap-4">
        <svg
          className="h-5 w-5 fill-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
        >
          {SpacesIconPath()}
        </svg>
        <p className="text-sm text-muted-foreground">
          {request.parkName || "N/A"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-4">
        <svg
          className="h-5 w-5 fill-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
        >
          {OccupantsIconPath()}
        </svg>
        <p className="text-sm text-muted-foreground">
          {request.assignedToName || "Unassigned"}
        </p>
      </div>
      <span className="text-xs font-normal text-muted-foreground">
        {new Date(request.createdAt).toLocaleString()}
      </span>
    </CardContent>
    <CardFooter className="flex flex-col items-start gap-2 p-2">
      {request.status === "received" && (
        <Button onClick={() => onAssign(request._id)} className="w-full">
          Assign
        </Button>
      )}
      {request.status === "assigned" && (
        <Button
          onClick={() => onComplete(request._id)}
          color="green"
          className="w-full"
        >
          Complete
        </Button>
      )}
      {request.status !== "received" && request.status !== "assigned" && null}
    </CardFooter>
  </Card>
);

export default function RequestsOverview() {
  const openSheet = useSheetStore((state) => state.openSheet);
  const requests = useQuery(
    api.requests.getRequestsForCards,
  ) as RequestCardData[];

  const handleOpenDropoffForm = () => {
    openSheet(
      "Park Vehicle",
      "Enter the details for the pickup request",
      <NewDropoffRequestForm />,
    );
  };

  const handleOpenPickupForm = () => {
    openSheet(
      "Request Vehicle/Item",
      "Enter the details for the pickup request",
      <NewRequestForm />,
    );
  };

  const assignRequest = useMutation(api.requests.assignRequest);
  const completeRequest = useMutation(api.requests.completeRequest);

  const { toast } = useToast();

  const handleAssignRequest = async (requestId: string) => {
    try {
      await assignRequest({ id: requestId as Id<"requests"> });
      toast({
        title: "Request Assigned",
        description: "The request has been successfully assigned.",
      });
    } catch (error) {
      console.error("Failed to assign request:", error);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the request.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      await completeRequest({ id: requestId as Id<"requests"> });
      toast({
        title: "Request Completed",
        description: "The request has been marked as completed.",
      });
    } catch (error) {
      console.error("Failed to complete request:", error);
      toast({
        title: "Completion Failed",
        description: "There was an error completing the request.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex h-[800px] flex-col gap-2 p-4">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-md font-medium">Valet Requests</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">+</Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <Button
              variant="ghost"
              onClick={handleOpenPickupForm}
              className="mb-2 w-full font-normal"
            >
              Request Vehicle/Item
            </Button>
            <Button
              variant="ghost"
              onClick={handleOpenDropoffForm}
              className="w-full font-normal"
            >
              Park Vehicle
            </Button>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="overflow-y-auto p-0">
        <div className="grid grid-cols-1 gap-2">
          {requests?.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onAssign={handleAssignRequest}
              onComplete={handleCompleteRequest}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
