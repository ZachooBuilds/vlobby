'use client';
import { Badge } from '@tremor/react';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui/card';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Button } from '@repo/ui/components/ui/button';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { WorkOrderSummaryCardData } from '../../../../lib/app-types';
import NoData from '../../../_components/no-data';

interface IssueWorkOrdersProps {
  issueId: Id<'issues'>;
  onSelectWorkOrder: (workOrderId: Id<'workOrders'>) => void;
}

export default function IssueWorkOrders({
  issueId,
  onSelectWorkOrder,
}: IssueWorkOrdersProps) {
  const workOrders = useQuery(api.workOrders.getWorkOrdersByTicketId, {
    ticketId: issueId,
  }) as WorkOrderSummaryCardData[];

  if (workOrders === undefined) {
    return (
      <div className="flex justify-center items-center h-full text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (workOrders.length === 0) {
    return (
      <div className="flex flex-col gap-4 pt-20">
        <NoData
          badgeText="No Work Orders"
          title="No Work Orders"
          description="No work orders created for this issue."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {workOrders.map((workOrder) => (
        <WorkOrderCard
          key={workOrder._id}
          workOrder={workOrder}
          onSelect={() => onSelectWorkOrder(workOrder._id as Id<'workOrders'>)}
        />
      ))}
    </div>
  );
}

function WorkOrderCard({
  workOrder,
  onSelect,
}: {
  workOrder: WorkOrderSummaryCardData;
  onSelect: () => void;
}) {
  const priorityColor =
    workOrder.priority.toLowerCase() === 'high'
      ? 'red'
      : workOrder.priority.toLowerCase() === 'medium'
        ? 'orange'
        : 'green';

  return (
    <Card
      className="w-full shadow-none transition-shadow duration-300 hover:border-muted hover:shadow-md hover:shadow-muted cursor-pointer"
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            {format(new Date(workOrder._creationTime), 'dd/MM/yyyy hh:mm a')}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Badge color={workOrder.status === 'completed' ? 'green' : 'blue'}>
              {workOrder.status}
            </Badge>
            <Badge color={priorityColor}>
              {workOrder.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="mb-2 font-medium">{workOrder.title}</h4>
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm text-gray-600">Assigned Contractor: </p>
          <div className="flex flex-row items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-muted-foreground text-[8px]">
                {workOrder.contractorFirstName?.charAt(0) ??
                  'N' + (workOrder.contractorLastName?.charAt(0) ?? 'A')}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-foreground">
              {`${workOrder.contractorFirstName ?? ''} ${workOrder.contractorLastName ?? ''} ${workOrder.contractorCompany ? `- ${workOrder.contractorCompany}` : ''}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
