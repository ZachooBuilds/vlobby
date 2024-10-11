'use client';
/**
 * @file IssueDetailsPage Component
 * @description This component provides the detailed view of a specific issue.
 * It includes issue details, notes, activity, and placeholders for work orders and invoices.
 */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@tremor/react';
import TicketUpsertForm from '../_forms/issues-upsert-form';
import { format } from 'date-fns';
import ConnectAssetDetailsCard from '../_components/connected-asset-summary';
import TicketDetailsCard from '../_components/issue-summary';
import WorkOrderUpsertForm from '../../work-orders/_forms/work-order-upsert-form';
import { TaskCard } from './_components/work-order-summary';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  AssignedUser,
  AssignedUserWithFormDetails,
  IssueFormDataWithNames,
  WorkOrderSummaryCardData,
} from '../../../lib/app-data/app-types';
import useModalStore from '../../../lib/global-state/modal-state';
import { api } from '@repo/backend/convex/_generated/api';
import { getUser } from '../../../../clerk-server/clerk';
import DetailsHeader from '../../_components/global-components/page-header';
import { IssueIconPath } from '../../../lib/icons/icons';
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
import useSheetStore from '../../../lib/global-state/sheet-state';
import UnderConstructionMessage from '../../_components/global-components/under-construction';

type IssueDetailsPageProps = {
  params: { id: Id<'issues'> };
};

/**
 * @function IssueDetailsPage
 * @description The main component for displaying detailed information about a specific issue
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {Id<"issues">} props.params.id - The ID of the issue to display
 * @returns {JSX.Element} The rendered IssueDetailsPage component
 */
export default function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  const issueId = params.id;
  const [assignedUser, setAssignedUser] = useState<AssignedUser>();
  const [creationUser, setCreationUser] = useState<AssignedUser>();
  const openModal = useModalStore((state) => state.openModal);

  // Retrieve data from convex backend
  const issueDetails = useQuery(api.tickets.getIssueById, {
    id: params.id,
  }) as IssueFormDataWithNames;

  // Calculate issueCreationTime outside the if block
  const issueCreationTime = issueDetails
    ? format(new Date(issueDetails._creationTime), 'dd/MM/yyyy h:mm a')
    : '';

  useEffect(() => {
    if (issueDetails) {
      const fetchUsers = async () => {
        try {
          if (issueDetails.assignedToId) {
            const assignedUser = await getUser(issueDetails.assignedToId);
            setAssignedUser(assignedUser);
          }
          if (issueDetails.userId) {
            const creationUser = await getUser(issueDetails.userId);
            setCreationUser(creationUser);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      void fetchUsers();
    }
  }, [issueDetails]);

  const completeIssueDetails: AssignedUserWithFormDetails = {
    ...issueDetails,
    creationFirstName: creationUser?.assignedFirstName ?? '',
    creationLastName: creationUser?.assignedLastName ?? '',
    creationEmail: creationUser?.assignedEmail ?? '',
    assignedFirstName: assignedUser?.assignedFirstName ?? '',
    assignedLastName: assignedUser?.assignedLastName ?? '',
  };

  const images = issueDetails?.files?.map((file) => file.url) ?? [];

  // Loading state if issue details have not been fetched
  if (issueDetails === undefined || issueDetails === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ); // Or use a loading spinner component
  }

  console.log('complete issue detailss:', completeIssueDetails);

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      {/* Details Page Header */}
      <DetailsHeader
        // title={`Issue Details | ${issueCreationTime ?? " "}`}
        title={`Issue Details | ${issueCreationTime}`}
        description={issueDetails.title}
        icon={<IssueIconPath />}
        FormComponent={<TicketUpsertForm selectedIssue={issueDetails} />}
      />

      {/* Summary Content */}
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* Left Column - 1/3 width */}
          <div className="w-full md:w-1/3">
            <ConnectAssetDetailsCard
              space={issueDetails.linkedAssetName}
              floor={issueDetails.floor ?? ''}
              location={issueDetails.locationName ?? ''}
              loggedBy={`${creationUser?.assignedFirstName} ${creationUser?.assignedLastName}`}
              email={creationUser?.assignedEmail ?? ''}
            />
          </div>

          {/* Right Column - 2/3 width */}
          <div className="w-full md:w-2/3">
            <TicketDetailsCard
              id={issueDetails._id!}
              status={issueDetails.status!}
              type={completeIssueDetails.issueType}
              tags={issueDetails.tags.map((tag) => tag.label)}
              priority={issueDetails.priority}
              assignedTo={
                assignedUser?.assignedFirstName
                  ? `${assignedUser.assignedFirstName} ${assignedUser.assignedLastName}`
                  : 'Unassigned'
              }
              description={issueDetails.description}
              images={images}
            />
          </div>
        </div>

        {/* Tabs Menu */}

        <Tabs defaultValue="notes" className="mt-4 w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
            <TabsTrigger value="invoices">Expenses & Invoices</TabsTrigger>
          </TabsList>

          <NotesTab issueId={issueId} />
          <ActivityTab issueId={issueId} />

          <WorkOrdersTab issueDetails={issueDetails} />
          <InvoicesTab />
          {/* Add content for other tabs as needed */}
        </Tabs>
      </div>
    </div>
  );
}

/**
 * @function NotesTab
 * @description Handles the display of notes related to the issue
 * @param {Object} props - Component props
 * @param {string} props.issueId - The ID of the issue
 * @returns {JSX.Element} Rendered component for the Notes tab
 */
function NotesTab({ issueId }: { issueId: string }) {
  const openModal = useModalStore((state) => state.openModal);
  const handleAddNote = () => {
    openModal(
      'Add Note',
      'Use the options below to edit an existing offer category.',
      <GlobalNoteForm noteType={'issue'} entityId={issueId} />
    );
  };

  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: 'issue',
    entityId: issueId,
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
              description={'No notes have been added for this issue.'}
              buttonText={'Add Note'}
              formComponent={
                <GlobalNoteForm noteType={'issue'} entityId={issueId} />
              }
              sheetTitle={'Add Note'}
              sheetDescription={'Add a note to this issue.'}
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
 * @description Handles the display of activity related to the issue
 * @param {Object} props - Component props
 * @param {string} props.issueId - The ID of the issue
 * @returns {JSX.Element} Rendered component for the Activity tab
 */
function ActivityTab({ issueId }: { issueId: string }) {
  const activityData = useQuery(api.activity.getEntityActivity, {
    entityId: issueId,
    isUserActivity: true,
  }) as TimelineItem[];

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
              description={'No activity has been recorded for this space.'}
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
 * @function WorkOrdersTab
 * @description Placeholder component for the Work Orders tab
 * @returns {JSX.Element} Rendered component for the Work Orders tab
 */
function WorkOrdersTab({
  issueDetails,
}: {
  issueDetails: IssueFormDataWithNames;
}) {
  const openSheet = useSheetStore((state) => state.openSheet);
  const handleAddWorkOrder = () => {
    openSheet(
      'Add Work Order',
      'Use the options below to edit an existing offer category.',
      <WorkOrderUpsertForm referenceIssue={issueDetails} />
    );
  };

  const workOrders = useQuery(api.workOrders.getWorkOrdersByTicketId, {
    ticketId: issueDetails._id ?? '',
  }) as WorkOrderSummaryCardData[];

  return (
    <TabsContent value="work-orders">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Work Orders</CardTitle>
          <Button onClick={handleAddWorkOrder} variant={'outline'}>
            Create Work Order
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {workOrders?.map((workOrderSummary) => (
            <TaskCard key={workOrderSummary._id} workOrder={workOrderSummary} />
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
            description="We're developing a powerful system to manage expenses and invoices related to this issue."
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}