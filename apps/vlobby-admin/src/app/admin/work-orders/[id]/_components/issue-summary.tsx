"use client";
import { useRouter } from "next/navigation";


import { Badge } from "@tremor/react";
import { format } from "date-fns";
import { IssueSummaryCardData } from "../../../../lib/app-data/app-types";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

interface IssueSummaryCardProps {
  issueSummary: IssueSummaryCardData;
}

export function IssueSummaryCard({ issueSummary }: IssueSummaryCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/admin/issues/${issueSummary._id}`);
  };

  return (
    <Card className="w-full  shadow-none transition-shadow duration-300 hover:border-muted hover:shadow-md hover:shadow-muted">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            {format(new Date(issueSummary._creationTime), "dd/MM/yyyy hh:mm a")}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Badge>{issueSummary.status}</Badge>
            <Badge>
              {issueSummary.priority.charAt(0).toUpperCase() +
                issueSummary.priority.slice(1)}
            </Badge>
            <Badge>
              Follow Up Date: 
              {format(
                new Date(issueSummary.followUpDate),
                "dd/MM/yyyy hh:mm a",
              )}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          Details
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-2">
          <h4 className="mb-2 font-medium">{issueSummary.title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          {issueSummary.description}
        </p>
      </CardContent>
    </Card>
  );
}
