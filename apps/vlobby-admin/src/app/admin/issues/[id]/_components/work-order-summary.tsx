"use client";
import { useRouter } from "next/navigation";
import { Badge } from "@tremor/react";
import { format } from "date-fns";
import { WorkOrderSummaryCardData } from "../../../../lib/app-data/app-types";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

interface TaskCardProps {
  workOrder: WorkOrderSummaryCardData;
}

export function TaskCard({ workOrder }: TaskCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/admin/work-orders/${workOrder._id}`);
  };

  return (
    <Card className="w-full  shadow-none transition-shadow duration-300 hover:border-muted hover:shadow-md hover:shadow-muted">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            {format(new Date(workOrder._creationTime), "dd/MM/yyyy hh:mm a")}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Badge>{workOrder.status}</Badge>
            <Badge>{workOrder.priority.toUpperCase()}</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          Details
        </Button>
      </CardHeader>
      <CardContent>
        <h4 className="mb-2 font-medium">{workOrder.title}</h4>

        <div className="flex flex-row items-center gap-2">
          <p className="text-sm text-gray-600">Assigned Contractor Details </p>
          <Button variant={"secondary"} className="flex flex-row gap-2">
            <Avatar className="h-5 w-5 ">
              <AvatarFallback className="bg-muted-foreground text-[8px]">
                {workOrder.contractorFirstName?.charAt(0) ??
                  "NA" + workOrder.contractorLastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-foreground">
              {`${workOrder.contractorFirstName ?? ""} ${workOrder.contractorLastName ?? ""} - ${workOrder.contractorCompany ?? ""}`}
            </p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
