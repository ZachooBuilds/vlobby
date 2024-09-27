"use client";

import { api } from "@repo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalenderEvent, EventWithSpaceName } from "../../lib/app-data/app-types";
import SectionHeader from "../_components/global-components/section-header";
import Calendar from "../_components/calender/calender";




export default function EventsPage() {
  const events = useQuery(
    api.events.getAllEventsWithDetails,
  ) as EventWithSpaceName[];

  console.log("all events", events);

  const formattedEvents: CalenderEvent[] =
    events?.map((event) => ({
      id: event._id!,
      title: event.title,
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      date: new Date(event.endTime),
      extendedProps: {
        linkedAssetId: event.spaceId ?? event.address ?? "", // Provide a fallback empty string
        linkedAssetName: event.facilityName ?? event.address,
        bottomText: event.facilityName ?? event.address ?? "", // Provide a fallback empty string
        eventData: event,
      },
    })) ?? [];

  console.log("formatted events", formattedEvents);

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <SectionHeader
        title="Events"
        description="Manage events for your organization. You can create new events, view existing ones, and set up recurring events for various purposes."
        buttonText="New Event"
        sheetTitle="Create Event"
        sheetDescription="Create a new event for your organization"
        sheetContent={"EventUpsertForm"}
        icon={"Event"}
      />
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-1">
        <Calendar events={formattedEvents} mode="Event" />
      </div>
    </div>
  );
}
