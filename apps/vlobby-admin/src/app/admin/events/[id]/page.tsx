"use client";
import React from "react";
import { useQuery } from "convex/react";
import EventUpsertForm from "../_forms/event-upsert-form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { EventFormData } from "../_forms/event-validation";
import EventOverview from "./_components/event-overview";
import AttendeesSummary from "./_components/atendees-summary";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { EventWithSpaceName } from "../../../lib/app-data/app-types";
import DetailsHeader from "../../_components/global-components/page-header";
import { EventIconPath } from "../../../lib/icons/icons";

type EventDetailsPageProps = {
  params: { id: string };
};

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const eventId = params.id;

  const event = useQuery(api.events.getEvent, {
    id: eventId as Id<"events">,
  }) as EventWithSpaceName;

  console.log("event raw", event);

  const formattedEvent = {
    ...event,
    startTime: new Date(event?.startTime),
    endTime: new Date(event?.endTime),
  };

  console.log("formattedEvent", formattedEvent);

  // Loading state
  if (event === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <DetailsHeader
        title={event.title}
        description=""
        icon={<EventIconPath />}
        FormComponent={<EventUpsertForm selectedEvent={formattedEvent} />}
      />
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* Left Column - 2/3 width */}
          <div className="w-full md:w-2/3">
            <EventOverview event={formattedEvent} />
          </div>
          {/* Right Column - 1/3 width */}
          <div className="w-full md:w-1/3">
            <AttendeesSummary eventId={eventId as Id<"events">} />
          </div>
        </div>
      </div>
    </div>
  );
}
