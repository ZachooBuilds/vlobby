"use client";
import React from "react";
import OccupantsList, { Occupant } from "./_components/occupants-summary";
import SpaceDetails from "./_components/space-overview";
import SmartLock from "./_components/device-overview";
import SpaceUpsertForm from "../_forms/upsert-space";
import { useQuery } from "convex/react";
import { SpacesTableEntry } from "../_table/spaces-table.jsx";
import { UpsertSpaceFormData } from "../_forms/upsert-space-validation.jsx";
import { Loader2 } from "lucide-react";
import { Badge } from "@tremor/react";
import { IssueSummaryCard } from "../../work-orders/[id]/_components/issue-summary";
import { TaskCard } from "../../issues/[id]/_components/work-order-summary";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import useModalStore from "../../../lib/global-state/modal-state";
import { api } from "@repo/backend/convex/_generated/api";
import GlobalNoteForm, { GlobalNoteData } from "../../_components/notes/global-note-form";
import DetailsHeader from "../../_components/global-components/page-header";
import { SpacesIconPath } from "../../../lib/icons/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import UnderConstructionMessage from "../../_components/global-components/under-construction";
import { Button } from "@repo/ui/components/ui/button";
import NoData from "../../_components/global-components/no-data";
import GlobalNote from "../../_components/notes/global-note";
import { ActivityTimeline, TimelineItem } from "../../_components/activity/activity-timeline";
import { IssueSummaryCardData, WorkOrderSummaryCardData } from "../../../lib/app-data/app-types";
import { Allocation } from "../../parking/_forms/allocation-validation";
import { Vehicle } from "../../parking/_forms/add-vehicle-validation";
import AllocationSummaryCard from "../../parking/_components/allocation-summary";
import VehicleSummaryCard from "../../parking/_components/vehicle-summary";


type SpacesDetailsPageProps = {
  params: { id: Id<"spaces"> };
};

export default function SpaceDetailsPage({ params }: SpacesDetailsPageProps) {
  const deviceIds = ["front-door-123", "back-door-456"];
  const spaceId = params.id;
  const openModal = useModalStore((state) => state.openModal);

  // Retrieve data from convex backend
  const spaceQuery = useQuery(api.spaces.getSpace, {
    id: params.id,
  }) as UpsertSpaceFormData;

  const spaceWithDetails = useQuery(api.spaces.getSpaceWithDetails, {
    id: params.id,
  }) as SpacesTableEntry;

  const occupants = useQuery(api.occupants.getUsersForSpace, {
    spaceId: params.id,
  });

  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: "space",
    entityId: spaceId,
  }) as GlobalNoteData[];

  const images = spaceQuery?.files?.map((file) => file.url) ?? [];

  // Loading state
  if (spaceQuery === undefined || spaceWithDetails === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ); // Or use a loading spinner component
  }

  const handleAddNote = () => {
    openModal(
      "Add Note",
      "Use the options below to edit an existing offer category.",
      <GlobalNoteForm noteType={"space"} entityId={spaceId} />,
    );
  };

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      {/* Details Page Header */}
      <DetailsHeader
        title={spaceQuery.spaceName}
        description={spaceQuery.description}
        icon={<SpacesIconPath />}
        FormComponent={<SpaceUpsertForm selectedSpace={spaceQuery} />}
      />

      {/* Summary Content */}
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* Left Column - 2/3 width */}
          <div className="w-full md:w-2/3">
            <SpaceDetails space={spaceWithDetails} images={images} />
          </div>
          {/* Right Column - 1/3 width */}
          <div className="w-full md:w-1/3">
            <OccupantsList
              occupants={occupants as Occupant[]}
              spaceId={params.id}
            />
          </div>
        </div>

        {/* Tabs Menu */}

        <Tabs defaultValue="notes" className="mt-4 w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="maintainence">Maintainence</TabsTrigger>
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
            <TabsTrigger value="letting">Letting</TabsTrigger>
          </TabsList>

          <NotesTab spaceId={spaceId} />
          <ActivityTab spaceId={spaceId} />

          <TicketsTab spaceId={spaceId} />
          <TabsContent value="access-control">
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-md mb-4 font-medium">
                  Connected Devices (2)
                </h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {deviceIds.map((deviceId) => (
                    <SmartLock key={deviceId} deviceId={deviceId} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="p-2">
              <UnderConstructionMessage />
            </Card>
          </TabsContent>

          <ParkingTab spaceId={spaceId} />

          <TabsContent value="letting">
            <Card className="p-4">
              <UnderConstructionMessage />
            </Card>
          </TabsContent>
          {/* Add content for other tabs as needed */}
        </Tabs>
      </div>
    </div>
  );
}

function NotesTab({ spaceId }: { spaceId: string }) {
  const openModal = useModalStore((state) => state.openModal);
  const handleAddNote = () => {
    openModal(
      "Add Note",
      "Use the options below to edit an existing offer category.",
      <GlobalNoteForm noteType={"space"} entityId={spaceId} />,
    );
  };

  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: "space",
    entityId: spaceId,
  }) as GlobalNoteData[];

  if (noteData === undefined || noteData.length < 1) {
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
                <GlobalNoteForm noteType={"occupant"} entityId={spaceId} />
              }
              sheetTitle={"Add Note"}
              sheetDescription={"Add a note to this occupant."}
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

function ActivityTab({ spaceId }: { spaceId: string }) {
  const activityData = useQuery(api.activity.getEntityActivity, {
    entityId: spaceId,
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
              badgeText={"No activity found"}
              title={"No activity recorded"}
              description={"No activity has been recorded for this space."}
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

function TicketsTab({ spaceId }: { spaceId: string }) {
  const workOrders = useQuery(api.workOrders.getWorkOrdersBySpaceId, {
    spaceId: spaceId as Id<"spaces">,
  }) as WorkOrderSummaryCardData[];

  const linkedIssues = useQuery(api.tickets.getTicketsBySpaceId, {
    spaceId: spaceId as Id<"spaces">,
  }) as IssueSummaryCardData[];

  const hasNoData =
    (!linkedIssues || linkedIssues.length === 0) &&
    (!workOrders || workOrders.length === 0);

  return (
    <TabsContent value="maintainence">
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
              description="This space has no associated tickets or work orders."
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

function ParkingTab({ spaceId }: { spaceId: string }) {
  const parkingAllocations = useQuery(api.allocations.getAllForSpace, {
    spaceId: spaceId as Id<"spaces">,
  }) as Allocation[];

  const connectedVehicles = useQuery(api.vehicles.getAllForSpace, {
    spaceId: spaceId as Id<"spaces">,
  }) as Vehicle[];

  const hasNoData =
    (!parkingAllocations || parkingAllocations.length === 0) &&
    (!connectedVehicles || connectedVehicles.length === 0);

  return (
    <TabsContent value="parking">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">
            Parking Allocations & Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {hasNoData ? (
            <NoData
              badgeText="No data"
              title="No parking allocations or vehicles found"
              description="This space has no associated parking allocations or vehicles."
            />
          ) : (
            <>
              {parkingAllocations && parkingAllocations.length > 0 && (
                <>
                  <p className="text-md font-medium">Parking Allocations</p>
                  {parkingAllocations.map((allocation) => (
                    <AllocationSummaryCard
                      key={allocation._id}
                      allocation={allocation}
                    />
                  ))}
                </>
              )}
              {connectedVehicles && connectedVehicles.length > 0 && (
                <>
                  <p className="text-md font-medium">Connected Vehicles</p>
                  {connectedVehicles.map((vehicle) => (
                    <VehicleSummaryCard key={vehicle._id} vehicle={vehicle} />
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
