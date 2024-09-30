"use client";
import React from "react";
import OccupantOverview from "./_components/occupant-summary";
import SpacesSummary, { SpaceSummary } from "./_components/spaces-summary";
import VehicleOverview from "./_components/vehicles-overview";
import { useQuery } from "convex/react";
import OccupantUpsertForm, { OccupantFormData } from "../_form/occupant-upsert";
import { Loader2 } from "lucide-react";
import { Badge } from "@tremor/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import DetailsHeader from "../../_components/global-components/page-header";
import { OccupantsIconPath } from "../../../lib/icons/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import useModalStore from "../../../lib/global-state/modal-state";
import GlobalNoteForm, { GlobalNoteData } from "../../_components/notes/global-note-form";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import NoData from "../../_components/global-components/no-data";
import GlobalNote from "../../_components/notes/global-note";
import { ActivityTimeline,TimelineItem } from "../../_components/activity/activity-timeline";
import UnderConstructionMessage from "../../_components/global-components/under-construction";
import { IssueSummaryCardData, WorkOrderSummaryCardData } from "../../../lib/app-data/app-types";
import { IssueSummaryCard } from "../../work-orders/[id]/_components/issue-summary";
import { TaskCard } from "../../issues/[id]/_components/work-order-summary";

type OccupantDetailsPageProps = {
  params: { id: string };
};

export default function OccupantDetailsPage({
  params,
}: OccupantDetailsPageProps) {
  console.log("Rendering OccupantDetailsPage with params:", params);
  const occupantId = params.id;
  // const openModal = useModalStore((state) => state.openModal);

  const occupant = useQuery(api.occupants.getUserWithSpaces, {
    userId: occupantId as Id<"users">,
  }) as OccupantFormData;
  console.log("Fetched occupant data:", occupant);

  const spaces = useQuery(api.spaces.getSpacesForUser, {
    id: occupantId as Id<"users">,
  });
  console.log("Fetched spaces data:", spaces);

  // Loading state
  if (occupant === undefined) {
    console.log("Occupant data is undefined, showing loading state");
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ); // Or use a loading spinner component
  }

  console.log("Rendering OccupantDetailsPage content");
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <DetailsHeader
        title={occupant.firstName + " " + occupant.lastName}
        description={occupant.notes ?? " "}
        icon={<OccupantsIconPath />}
        FormComponent={<OccupantUpsertForm selectedOccupant={occupant} />}
      />
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="w-full ">
            <OccupantOverview occupant={occupant} />
          </div>
          <div className="w-full ">
            <SpacesSummary
              spaces={spaces as SpaceSummary[]}
              userId={occupantId}
            />
          </div>
        </div>
        <Tabs defaultValue="notes" className="mt-4 w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
            <TabsTrigger value="tickets">Tickets & Work Orders</TabsTrigger>
            {/* <TabsTrigger value="vehicles">Vehicles</TabsTrigger> */}
          </TabsList>

          <NotesTab occupantId={occupantId} />
          <ActivityTab occupantId={occupantId} />
          <AccessTab />
          <TicketsTab userId={occupantId} />
          <VehiclesTab />
        </Tabs>
      </div>
    </div>
  );
}

function NotesTab({ occupantId }: { occupantId: string }) {
  console.log("Rendering NotesTab for occupantId:", occupantId);
  const openModal = useModalStore((state) => state.openModal);
  const handleAddNote = () => {
    console.log("Opening modal to add note");
    openModal(
      "Add Note",
      "Use the options below to edit an existing offer category.",
      <GlobalNoteForm noteType={"occupant"} entityId={occupantId} />,
    );
  };

  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: "occupant",
    entityId: occupantId,
  }) as GlobalNoteData[];
  console.log("Fetched note data:", noteData);

  if (noteData === undefined || noteData.length < 1) {
    console.log("No notes found for occupant");
    return (
      <TabsContent value="notes">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Notes</CardTitle>
            <Button onClick={handleAddNote} variant={"outline"}>
              Add Note
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NoData
              badgeText={"No notes found"}
              title={"No notes found"}
              description={"No notes have been added for this occupant."}
              buttonText={"Add Note"}
              formComponent={
                <GlobalNoteForm noteType={"occupant"} entityId={occupantId} />
              }
              sheetTitle={"Add Note"}
              sheetDescription={"Add a note to this occupant."}
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  console.log("Rendering notes for occupant");
  return (
    <TabsContent value="notes">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Notes</CardTitle>
          <Button onClick={handleAddNote} variant={"outline"}>
            Add Note
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {noteData.length > 0 && (
            <>
              <div className="flex flex-row gap-2">
                <p className="text-md font-medium">All Notes</p>
                <Badge size={"xs"}>{noteData.length} Total</Badge>
                <Badge size={"xs"} color={"gray"}>
                  {noteData.filter((note) => !note.isPrivate).length} Public
                </Badge>
                <Badge size={"xs"} color={"gray"}>
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

function ActivityTab({ occupantId }: { occupantId: string }) {
  console.log("Rendering ActivityTab for occupantId:", occupantId);
  const activityData = useQuery(api.activity.getEntityActivity, {
    entityId: occupantId,
    isUserActivity: true,
  }) as TimelineItem[];
  console.log("Fetched activity data:", activityData);

  if (activityData === undefined || activityData.length < 1) {
    console.log("No activity found for occupant");
    return (
      <TabsContent value="activity">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NoData
              badgeText={"No activity found"}
              title={"No activity recorded"}
              description={"No activity has been recorded for this occupant."}
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  console.log("Rendering activity timeline for occupant");
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

function AccessTab() {
  console.log("Rendering AccessTab");
  return (
    <TabsContent value="access">
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">Access</CardTitle>
        </CardHeader>
        <CardContent>
          <UnderConstructionMessage />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function TicketsTab({ userId }: { userId: string }) {
  console.log("Rendering TicketsTab for userId:", userId);
  const workOrders = useQuery(api.workOrders.getWorkOrdersByUserId, {
    userId: userId,
  }) as WorkOrderSummaryCardData[];
  console.log("Fetched work orders:", workOrders);

  const linkedIssues = useQuery(api.tickets.getTicketsByUserId, {
    userId: userId,
  }) as IssueSummaryCardData[];
  console.log("Fetched linked issues:", linkedIssues);

  const hasNoData =
    (!linkedIssues || linkedIssues.length === 0) &&
    (!workOrders || workOrders.length === 0);

  console.log("Has no data:", hasNoData);

  return (
    <TabsContent value="tickets">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">
            Tickets & Work Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {hasNoData ? (
            <NoData
              badgeText="No data"
              title="No tickets or work orders found"
              description="This occupant has no associated tickets or work orders."
            />
          ) : (
            <>
              {linkedIssues && linkedIssues.length > 0 && (
                <>
                  <p className="text-md font-medium">Tickets</p>
                  {linkedIssues.map((issue) => (
                    <IssueSummaryCard key={issue._id} issueSummary={issue} />
                  ))}
                </>
              )}
              {workOrders && workOrders.length > 0 && (
                <>
                  <p className="text-md font-medium">Work Orders</p>
                  {workOrders.map((workOrderSummary) => (
                    <TaskCard
                      key={workOrderSummary._id}
                      workOrder={workOrderSummary}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function VehiclesTab() {
  console.log("Rendering VehiclesTab");
  return (
    <TabsContent value="vehicles">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Vehicles</CardTitle>
          <Button variant="outline"> Add Vehicle </Button>
        </CardHeader>
        <CardContent>
          <VehicleOverview spaceId={""} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
