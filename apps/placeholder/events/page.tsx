'use client';

import React, { useState } from 'react';
import NavigationBar from '../_components/navigation';
import { EventIconPath } from '../../../public/svg/icons';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { EventDetails } from '../../lib/app-types';
import NoData from '../_components/no-data';
import EventCard from './_components/event-card';
import { Loader2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import EventOverview from './_components/event-overview';
import { Button } from '@repo/ui/components/ui/button'; // Add this import

export default function EventsPage() {
  const events = useQuery(api.events.getAllEventsWithDetails);
  const occupantEvents = useQuery(
    api.events.getAllEventsWithDetailsForCurrentOccupant
  );
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <EventIconPath />
            </div>
            <h2 className="text-xl font-semibold">Events</h2>
          </div>
          <EventsContentLoader
            events={events}
            occupantEvents={occupantEvents}
            isLoading={events === undefined || occupantEvents === undefined}
            onEventClick={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}

function EventsContentLoader({
  events,
  occupantEvents,
  isLoading,
  onEventClick,
  selectedEvent,
}: {
  events?: EventDetails[];
  occupantEvents?: EventDetails[];
  isLoading: boolean;
  onEventClick: (event: EventDetails | null) => void; // Update this type
  selectedEvent: EventDetails | null;
}) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    (!events || events.length === 0) &&
    (!occupantEvents || occupantEvents.length === 0)
  ) {
    return (
      <NoData
        badgeText="No data available"
        title="No Events"
        description="No events have been added yet."
      />
    );
  }

  if (selectedEvent) {
    return (
      <div className="w-full">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => onEventClick(null)}
        >
          Back to Events
        </Button>
        <EventOverview event={selectedEvent} />
      </div>
    );
  }

  return (
    <Tabs defaultValue="all-events" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="all-events" className="w-full">
          All Events
        </TabsTrigger>
        <TabsTrigger value="my-events" className="w-full">
          My Events
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all-events">
        {events && events.length > 0 ? (
          <div className="grid w-full grid-cols-1 items-start justify-start gap-2 rounded-lg bg-background md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event._id} onClick={() => onEventClick(event)}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <NoData
            badgeText="Where are the events?"
            title="No Events"
            description="No events have been added yet. Create a new event to get started."
          />
        )}
      </TabsContent>
      <TabsContent value="my-events">
        {occupantEvents && occupantEvents.length > 0 ? (
          <div className="grid w-full grid-cols-1 items-start justify-start gap-4 rounded-lg bg-background md:grid-cols-2 lg:grid-cols-3">
            {occupantEvents.map((event) => (
              <EventCard event={event} key={event._id} />
            ))}
          </div>
        ) : (
          <NoData
            badgeText="No events found"
            title="No Events"
            description="You haven't joined any events yet."
          />
        )}
      </TabsContent>
      {selectedEvent && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Event Details</h3>
          <EventOverview event={selectedEvent} />
        </div>
      )}
    </Tabs>
  );
}
