'use client';
/**
 * @file WorkOrderDetailsPage Component
 * @description This component provides the detailed view of a specific work order.
 * It includes work order details, notes, activity, and placeholders for invoices.
 */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@tremor/react';
import WorkOrderUpsertForm from '../_forms/work-order-upsert-form';
import { format } from 'date-fns';
import ConnectAssetDetailsCard from '../_components/connected-asset-summary';
import WorkOrderDetailsCard from '../_components/work-order-summary';
import { IssueSummaryCard } from './_components/issue-summary';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  AssignedUserWithWorkOrderDetails,
  IssueSummaryCardData,
  WorkOrderFormDataWithNames,
  UserCoreDetails,
} from '../../../lib/app-data/app-types';
import useModalStore from '../../../lib/global-state/modal-state';
import { api } from '@repo/backend/convex/_generated/api';
import DetailsHeader from '../../_components/global-components/page-header';
import { WorkOrderIconPath } from '../../../lib/icons/icons';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import GlobalNoteForm, {
  GlobalNoteData,
} from '../../_components/notes/global-note-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import NoData from '../../_components/global-components/no-data';
import GlobalNote from '../../_components/notes/global-note';
import {
  ActivityTimeline,
  TimelineItem,
} from '../../_components/activity/activity-timeline';
import UnderConstructionMessage from '../../_components/global-components/under-construction';

type WorkOrderDetailsPageProps = {
  params: { id: Id<'workOrders'> };
};

/**
 * @function WorkOrderDetailsPage
 * @description The main component for displaying detailed information about a specific work order
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {Id<"workOrders">} props.params.id - The ID of the work order to display
 * @returns {JSX.Element} The rendered WorkOrderDetailsPage component
 */
export default function WorkOrderDetailsPage({
  params,
}: WorkOrderDetailsPageProps) {
  const workOrderId = params.id;
  const openModal = useModalStore((state) => state.openModal);

  // Retrieve data from convex backend
  const workOrderDetails = useQuery(api.workOrders.getWorkOrderById, {
    id: params.id,
  }) as WorkOrderFormDataWithNames;

  // Calculate workOrderCreationTime outside the if block
  const workOrderCreationTime = workOrderDetails
    ? format(new Date(workOrderDetails._creationTime), 'dd/MM/yyyy h:mm a')
    : '';

  const creationUser = useQuery(api.allUsers.getUserById, {
    userId: workOrderDetails?.userId ?? '',
  }) as UserCoreDetails;

  const assignedUser = useQuery(api.allUsers.getUserById, {
    userId: workOrderDetails?.assignedContractorId ?? '',
  }) as UserCoreDetails;

  const completeWorkOrderDetails: AssignedUserWithWorkOrderDetails = {
    ...workOrderDetails,
    creationFirstName: creationUser?.firstname ?? '',
    creationLastName: creationUser?.lastname ?? '',
    creationEmail: creationUser?.email ?? '',
    assignedFirstName: assignedUser?.firstname ?? '',
    assignedLastName: assignedUser?.lastname ?? '',
  };

  const images = workOrderDetails?.files?.map((file) => file.url) ?? [];

  // Loading state if work order details have not been fetched
  if (workOrderDetails === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ); // Or use a loading spinner component
  }

  console.log('complete work order details:', completeWorkOrderDetails);

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      {/* Details Page Header */}
      <DetailsHeader
        title={`Work Order Details | ${workOrderCreationTime}`}
        description={workOrderDetails.title}
        icon={<WorkOrderIconPath />}
        FormComponent={
          <WorkOrderUpsertForm selectedWorkOrder={workOrderDetails} />
        }
      />

      {/* Summary Content */}
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* Left Column - 2/3 width */}
          <div className="w-full md:w-2/3">
            <WorkOrderDetailsCard
              _id={workOrderId}
              status={workOrderDetails.status ?? ''}
              type={completeWorkOrderDetails.workOrderType}
              tags={workOrderDetails.tags.map((tag) => tag.label)}
              priority={workOrderDetails.priority}
              assignedContractor={workOrderDetails.assignedContractor}
              description={workOrderDetails.description}
              title={workOrderDetails.title}
              images={images}
            />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="w-full md:w-1/3">
            <ConnectAssetDetailsCard
              space={workOrderDetails.linkedAssetName}
              floor={workOrderDetails.floor ?? ''}
              location={workOrderDetails.locationName ?? ''}
              loggedBy={`${creationUser?.firstname} ${creationUser?.lastname}`}
              email={creationUser?.email ?? ''}
            />
          </div>
        </div>

        {/* Tabs Menu */}

        <Tabs defaultValue="notes" className="mt-4 w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="issues">Linked Issues</TabsTrigger>
            <TabsTrigger value="invoices">Expenses & Invoices</TabsTrigger>
          </TabsList>

          <NotesTab workOrderId={workOrderId} />
          <ActivityTab workOrderId={workOrderId} />
          <IssuesTab workOrderId={workOrderId} />
          <InvoicesTab />
          {/* Add content for other tabs as needed */}
        </Tabs>
      </div>
    </div>
  );
}

/**
 * @function NotesTab
 * @description Handles the display of notes related to the work order
 * @param {Object} props - Component props
 * @param {string} props.workOrderId - The ID of the work order
 * @returns {JSX.Element} Rendered component for the Notes tab
 */
function NotesTab({ workOrderId }: { workOrderId: string }) {
  const openModal = useModalStore((state) => state.openModal);
  const handleAddNote = () => {
    openModal(
      'Add Note',
      'Use the options below to add a note to this work order.',
      <GlobalNoteForm noteType={'workOrder'} entityId={workOrderId} />
    );
  };

  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: 'workOrder',
    entityId: workOrderId,
  }) as GlobalNoteData[];

  if (noteData === undefined || noteData.length < 1) {
    return (
      <TabsContent value="notes">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Notes</CardTitle>
            <Button onClick={handleAddNote} variant={'outline'}>
              Add Note
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NoData
              badgeText={'No notes found'}
              title={'No notes found'}
              description={'No notes have been added for this work order.'}
              buttonText={'Add Note'}
              formComponent={
                <GlobalNoteForm noteType={'workOrder'} entityId={workOrderId} />
              }
              sheetTitle={'Add Note'}
              sheetDescription={'Add a note to this work order.'}
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="notes">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Notes</CardTitle>
          <Button onClick={handleAddNote} variant={'outline'}>
            Add Note
          </Button>
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
    </TabsContent>
  );
}

/**
 * @function ActivityTab
 * @description Handles the display of activity related to the work order
 * @param {Object} props - Component props
 * @param {string} props.workOrderId - The ID of the work order
 * @returns {JSX.Element} Rendered component for the Activity tab
 */
function ActivityTab({ workOrderId }: { workOrderId: string }) {
  const activityData = useQuery(api.activity.getEntityActivity, {
    entityId: workOrderId,
  }) as TimelineItem[];

  console.log('activityData:', activityData);

  if (activityData === undefined || activityData.length < 1) {
    return (
      <TabsContent value="activity">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NoData
              badgeText={'No activity found'}
              title={'No activity recorded'}
              description={'No activity has been recorded for this work order.'}
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="activity">
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline items={activityData} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

/**
 * @function IssuesTab
 * @description Placeholder component for the Expenses & Invoices tab
 * @returns {JSX.Element} Rendered component for the Invoices tab
 */
function IssuesTab({ workOrderId }: { workOrderId: string }) {
  const linkedIssues = useQuery(api.tickets.getLinkedIssuesByWorkOrderId, {
    workOrderId: workOrderId as Id<'workOrders'>,
  }) as IssueSummaryCardData[];

  return (
    <TabsContent value="issues">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Linked Issues</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {linkedIssues?.map((issue) => (
            <IssueSummaryCard key={issue._id} issueSummary={issue} />
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

/**
 * @function InvoicesTab
 * @description Placeholder component for the Expenses & Invoices tab
 * @returns {JSX.Element} Rendered component for the Invoices tab
 */
function InvoicesTab() {
  return (
    <TabsContent value="invoices">
      <Card>
        <CardContent className="p-6">
          <UnderConstructionMessage
            badgeText="Coming Soon"
            title="Expenses & Invoices"
            description="We're developing a powerful system to manage expenses and invoices related to this work order."
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
