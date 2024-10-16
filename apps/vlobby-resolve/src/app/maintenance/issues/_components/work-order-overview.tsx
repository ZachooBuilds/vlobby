'use client';
import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@repo/ui/components/ui/card';
import { Badge } from '@tremor/react';
import { Button } from '@repo/ui/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@repo/ui/components/ui/avatar';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Loader2, CheckCircle } from 'lucide-react';
import { WorkOrderDetails } from '../../../../lib/app-types';
import ImageGalleryComponent from '../../../_components/image-gallery';
import { GlobalNoteData } from '../_form/global-note-form';
import Link from 'next/link';
import NoData from '../../../_components/no-data';
import GlobalNote from '../_form/global-note';

interface WorkOrdersOverviewProps {
  workOrderId: string;
  onClose: () => void;
}

export default function WorkOrderOverview({
  workOrderId,
  onClose,
}: WorkOrdersOverviewProps) {
  const workOrder = useQuery(api.workOrders.getWorkOrderById, {
    id: workOrderId as Id<'workOrders'>,
  }) as WorkOrderDetails;

  if (!workOrder) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  console.log('workOrder', workOrder);

  const priorityColor =
    workOrder.priority.toLowerCase() === 'high'
      ? 'red'
      : workOrder.priority.toLowerCase() === 'medium'
        ? 'orange'
        : 'green';

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-md">{workOrder.title}</CardTitle>

            <Badge
              icon={
                workOrder.status.toLowerCase() === 'resolved'
                  ? CheckCircle
                  : undefined
              }
              color={
                workOrder.status.toLowerCase() === 'resolved'
                  ? 'green'
                  : workOrder.status.toLowerCase() === 'pending'
                    ? 'orange'
                    : 'gray'
              }
              size="xs"
            >
              {workOrder.status}
            </Badge>
          </div>
          <div className="flex flex-row gap-2">
            <Badge size="xs">
              {workOrder.workOrderType.charAt(0).toUpperCase() +
                workOrder.workOrderType.slice(1)}{' '}
              Work Order
            </Badge>
            <Badge size="xs" color={priorityColor}>
              {workOrder.priority.charAt(0).toUpperCase() +
                workOrder.priority.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Logged:{' '}
            {format(new Date(workOrder._creationTime), 'MMM d, yyyy HH:mm')}
          </p>
          <h3 className="text-md font-semibold mb-2">Description</h3>
          <p className="text-sm">{workOrder.description}</p>
          {workOrder.tags && workOrder.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {workOrder.tags.map((tag, index) => (
                  <Badge key={index} size="xs">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {workOrder.images && workOrder.images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Attachments</h3>
              <ImageGalleryComponent images={workOrder.images} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} variant="outline" className="w-full">
            Back to Work Orders
          </Button>
        </CardFooter>
      </Card>
      {workOrder.assignedContractor && (
        <AssignedContractorDetails
          assignedContractor={workOrder.assignedContractor}
        />
      )}
      <NotesTab workOrderId={workOrderId} />
      {/* <ActivityFeed issueId={issue._id} /> */}
    </div>
  );
}

function AssignedContractorDetails({
  assignedContractor,
}: {
  assignedContractor: { name: string; businessName: string; email: string };
}) {
  if (!assignedContractor) {
    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="text-md">Assigned Contractor</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge color="gray">No contractor assigned yet</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-md">Assigned Contractor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${assignedContractor.name}`}
            />
            <AvatarFallback>{assignedContractor.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{assignedContractor.name}</p>
            <p className="text-sm text-muted-foreground">
              {assignedContractor.businessName}
            </p>
            <p className="text-sm text-muted-foreground">
              {assignedContractor.email}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {assignedContractor.name} will arrange a time to resolve this issue.
        </p>
      </CardFooter>
    </Card>
  );
}

/**
 * @function NotesTab
 * @description Handles the display of notes related to the issue
 * @param {Object} props - Component props
 * @param {string} props.issueId - The ID of the issue
 * @returns {JSX.Element} Rendered component for the Notes tab
 */
function NotesTab({ workOrderId }: { workOrderId: string }) {
  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: 'workOrder',
    entityId: workOrderId,
  }) as GlobalNoteData[];

  if (noteData === undefined || noteData.length < 1) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Notes</CardTitle>
          <Link
            href={`/maintenance/issues/new-work-order-note?workOrderId=${workOrderId}`}
            passHref
          >
            <Button variant={'outline'}>Add Note</Button>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NoData
            badgeText={'No notes found'}
            title={'No notes found'}
            description={'No notes have been added for this issue.'}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">Notes</CardTitle>
        <Link
          href={`/maintenance/issues/new-work-order-note?workOrderId=${workOrderId}`}
          passHref
        >
          <Button variant={'outline'}>Add Note</Button>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {noteData.length > 0 && (
          <>
            <div className="flex flex-row gap-2">
              <p className="text-md font-medium">All Notes</p>
              <Badge size={'xs'}>{noteData.length} Total</Badge>
              <Badge size={'xs'} color={'gray'}>
                {noteData.filter((note) => !note.isPrivate).length} Public
              </Badge>
              <Badge size={'xs'} color={'gray'}>
                {noteData.filter((note) => note.isPrivate).length} Private
              </Badge>
            </div>
            {noteData.map((note) => (
              <GlobalNote key={note._id} {...note} />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
