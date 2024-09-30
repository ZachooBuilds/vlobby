import React from "react";
import { Badge } from "@tremor/react";
import { useMutation } from "convex/react";
import { CheckCircleIcon, UserIcon } from "lucide-react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { toast } from "@repo/ui/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { WorkOrderIconPath } from "../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";
import ImageGalleryComponent from "../../_components/global-components/image-gallery";

interface WorkOrderDetailsProps {
  _id: string;
  type: string;
  tags: string[];
  title: string;
  priority: string;
  assignedContractor: {
    name: string;
    businessName: string;
    email: string;
  } | null;
  description: string;
  images: string[];
  status: string;
}

export default function WorkOrderDetailsCard({
  _id,
  type,
  title,
  tags,
  priority,
  assignedContractor,
  description,
  images,
  status,
}: WorkOrderDetailsProps) {
  const updateWorkOrderStatus = useMutation(
    api.workOrders.updateWorkOrderStatus,
  );
  const handleStatusUpdate = (newStatus: string) => async () => {
    try {
      await updateWorkOrderStatus({
        status: newStatus,
        workOrderId: _id as Id<"workOrders">,
      });
      toast({
        title: "Work Order Status Updated",
        description: `The work order status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating work order status:", error);
      toast({
        title: "Error",
        description: "Failed to update work order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(title);
    const mailtoLink = `mailto:${assignedContractor?.email}?subject=${subject}`;
    window.location.href = mailtoLink;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md flex w-full flex-row items-center justify-between font-medium">
          <div className="flex flex-row items-center gap-2">
            <svg
              className="h-5 w-5 fill-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
            >
              {WorkOrderIconPath()}
            </svg>
            Work Order Details
          </div>
          <div>
            {status === "Assigned" && (
              <Button
                onClick={handleStatusUpdate("Resolved")}
                variant="outline"
              >
                <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                Mark as Resolved
              </Button>
            )}
            {status === "Resolved" && (
              <Button onClick={handleStatusUpdate("Pending")} variant="ghost">
                Re-Open Issue
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <DetailItem label="Type" value={type} isBadge={true} />
          <DetailItem label="Priority" value={priority} isBadge={true} />
          <DetailItem label="Status" value={status} isBadge={true} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Tags</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} color={"purple-400"}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="text-sm">{description}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Images</p>
          <ImageGalleryComponent images={images} />
        </div>

        {status !== "Pending" && (
          <div>
            <p className="mb-2 flex items-center text-sm text-muted-foreground">
              <UserIcon className="mr-2 h-4 w-4" />
              Assigned Contractor
            </p>
            <div className="flex flex-row items-start justify-between border border-muted bg-muted/20 p-4">
              <div className="flex flex-col rounded-md">
                <p className="text-sm font-medium">
                  {assignedContractor?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {assignedContractor?.businessName}
                </p>
              </div>
              <Button variant="secondary" onClick={handleEmailClick}>
                Send Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  isBadge = false,
}: {
  label: string;
  value: string;
  isBadge?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {isBadge ? (
        <Badge color={getBadgeColor(label, value)}>
          {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
        </Badge>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}

function getBadgeColor(label: string, value?: string): string {
  switch (label.toLowerCase()) {
    case "type":
      return "blue-400";
    case "tags":
      return "green-400";
    case "category":
      return "orange-400";
    case "priority":
      if (value) {
        switch (value.toLowerCase()) {
          case "low":
            return "green-400";
          case "medium":
            return "orange-400";
          case "high":
            return "red-400";
          default:
            return "gray-400";
        }
      }
      return "gray-400";
    case "status":
      if (value) {
        switch (value.toLowerCase()) {
          case "pending":
            return "red-400";
          case "assigned":
            return "yellow-400";
          case "resolved":
            return "green-400";
          case "on hold":
            return "orange-400";
          default:
            return "gray-400";
        }
      }
      return "gray-400";
    default:
      return "gray-400";
  }
}
