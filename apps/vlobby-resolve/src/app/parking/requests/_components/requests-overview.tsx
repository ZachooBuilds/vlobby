'use client';
import { useQuery, useMutation } from 'convex/react';
import { Badge } from '@tremor/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { api } from '@repo/backend/convex/_generated/api';
import { useToast } from '@repo/ui/hooks/use-toast';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { RequestCardData } from '../../../../lib/app-types';
import {
  OccupantsIconPath,
  ParkIconPath,
  SpacesIconPath,
} from '../../../../../public/svg/icons';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';

const RequestCard = ({
  request,
  onAssign,
  onComplete,
  isLoading,
}: {
  request: RequestCardData;
  onAssign: (id: string) => void;
  onComplete: (id: string) => void;
  isLoading: boolean;
}) => (
  <Card key={request._id} className="flex flex-col gap-1 p-2">
    <CardHeader className="flex flex-row items-center justify-between p-0">
      <Badge
        color={
          request.requestType.startsWith('pickup')
            ? 'pink'
            : request.requestType.startsWith('dropoff')
              ? 'violet'
              : 'purple'
        }
      >
        {request.requestType
          .replace(':', '- ')
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </Badge>
      <Badge
        size="sm"
        color={
          request.status === 'received'
            ? 'red'
            : request.status === 'assigned'
              ? 'orange'
              : 'green'
        }
      >
        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
      </Badge>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 p-2">
      <div>
        <p className="font-medium">{request.vehicleDetails}</p>
        {/* <p className="text-sm text-muted-foreground">
          {request.assignedToName || 'Unassigned'}
        </p> */}
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
          {request.parkName || 'N/A'}
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
          {request.assignedToName || 'Unassigned'}
        </p>
      </div>
      <span className="text-xs font-normal text-muted-foreground">
        {new Date(request.createdAt).toLocaleString()}
      </span>
    </CardContent>
    <CardFooter className="flex flex-col items-start gap-2 p-2">
      {request.status === 'received' && (
        <Button
          onClick={() => onAssign(request._id)}
          className="w-full h-16"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin " /> : 'Assign'}
        </Button>
      )}
      {request.status === 'assigned' && (
        <Button
          onClick={() => onComplete(request._id)}
          className="w-full h-16 bg-green-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin " />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          )}
        </Button>
      )}
      {request.status !== 'received' && request.status !== 'assigned' && null}
    </CardFooter>
  </Card>
);

export default function RequestsOverview() {
  const requests = useQuery(
    api.requests.getRequestsForCards
  ) as RequestCardData[];

  const assignRequest = useMutation(api.requests.assignRequest);
  const completeRequest = useMutation(api.requests.completeRequest);

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await assignRequest({ id: requestId as Id<'requests'> });
    } catch (error) {
      console.error('Failed to assign request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await completeRequest({ id: requestId as Id<'requests'> });
    } catch (error) {
      console.error('Failed to complete request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!requests) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row items-center gap-2">
          <div className="w-5 h-5 fill-foreground">
            <ParkIconPath />
          </div>
          <h1 className="text-2xl font-medium">Valet Requests</h1>
        </div>
        <div className="grid w-full grid-cols-1 items-start justify-start gap-2 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="w-5 h-5 fill-foreground">
            <ParkIconPath />
          </div>
          <h1 className="text-2xl font-medium">Valet Requests</h1>
        </div>
        <Badge color={'purple'}>
          {
            requests?.filter(
              (request) =>
                request.status === 'pending' ||
                request.status === 'assigned' ||
                request.status === 'received'
            ).length
          }{' '}
          active requests
        </Badge>
      </div>
      {requests?.map((request) => (
        <RequestCard
          key={request._id}
          request={request}
          onAssign={handleAssignRequest}
          onComplete={handleCompleteRequest}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
