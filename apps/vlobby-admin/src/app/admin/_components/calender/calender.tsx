"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  type EventClickArg,
  type EventContentArg,
} from "@fullcalendar/core/index.js";
import interactionPlugin, {
  DateClickArg,
} from "@fullcalendar/interaction";
import { Badge } from "@tremor/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRouter } from "next/navigation";
import { CalenderEvent, EventWithSpaceName, FacilityFormDataWithNames } from "../../../lib/app-data/app-types";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { BookingFormData } from "../../bookings/_forms/booking-validation";
import BookingUpsertForm from "../../bookings/_forms/booking-upsert-form";
import EventUpsertForm from "../../events/_forms/event-upsert-form";
import { colorsList } from "../../../lib/app-data/static-data";
import { format } from "date-fns";

/**
 * Define the props interface for the Calendar component
 * @typedef {Object} calenderProps
 * @property {CalenderEvent[]} [events] - Array of calendar events
 * @property {"Booking" | "Event" | "facility"} [mode] - Mode of operation for the calendar
 * @property {FacilityFormDataWithNames} [selectedFacility] - Selected facility data
 */
interface calenderProps {
  events?: CalenderEvent[];
  mode?: "Booking" | "Event" | "facility";
  selectedFacility?: FacilityFormDataWithNames;
}

/**
 * Main Calendar component
 * This component renders a full-featured calendar with event handling capabilities
 *
 * @param {calenderProps} props - The component props
 * @returns {JSX.Element} The rendered Calendar component
 */
export default function Calendar({
  events,
  mode,
  selectedFacility,
}: calenderProps = {}) {
  const calendarRef = useRef<FullCalendar>(null);
  const openSheet = useSheetStore((state) => state.openSheet);
  const router = useRouter();

  /**
   * Effect to handle calendar API initialization
   * Additional calendar API setup can be done here
   */
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) {
      return;
    }
    // Additional calendar API setup can be done here
  }, []);

  /**
   * Handle event click to open event edit form or booking edit form
   * @param {EventClickArg} clickInfo - Information about the clicked event
   */
  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("Event clicked:", clickInfo);
    if (mode === "Event") {
      const event = clickInfo.event.extendedProps.eventData as EventWithSpaceName;
      console.log("Event data:", event);
      router.push(`/admin/events/${event._id}`);
    } else {
      const booking = clickInfo.event.extendedProps.bookingData as BookingFormData;
      console.log("Booking data:", booking);
      openSheet(
        "Edit Booking",
        "Use the form below to edit the selected booking.",
        <BookingUpsertForm
          selectedFacility={selectedFacility ?? undefined}
          selectedBooking={booking}
        />,
      );
    }
  };

  /**
   * Handle date click to open event creation form or booking creation form
   * @param {DateClickArg} selectInfo - Information about the clicked date
   */
  const handleDateClick = (selectInfo: DateClickArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    if (mode === "Event") {
      openSheet(
        "Create Event",
        "Use the form below to create a new event for the selected date.",
        <EventUpsertForm selectedDate={selectInfo.date} />,
      );
    } else {
      openSheet(
        "Create Booking",
        "Use the form below to create a new booking for the selected time slot.",
        <BookingUpsertForm
          selectedFacility={selectedFacility}
          selectedDate={selectInfo.date}
        />,
      );
    }
  };

  /**
   * Create a memoized color mapping for linked asset names
   * This ensures consistent coloring for events associated with the same asset
   */
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    events?.forEach((event) => {
      if (!map.has(event.extendedProps.linkedAssetName)) {
        map.set(
          event.extendedProps.linkedAssetName,
          colorsList[map.size % colorsList.length]?.hex ?? colorsList[0]!.hex,
        );
      }
    });
    return map;
  }, [events]);

  /**
   * Custom render function for event content
   * This function determines how each event is displayed on the calendar
   * @param {EventContentArg} eventInfo - Information about the event to be rendered
   * @returns {JSX.Element} The rendered event content
   */
  const renderEventContent = (eventInfo: EventContentArg) => {
    const color =
      colorMap.get(eventInfo.event.extendedProps.linkedAssetName as string) ??
      colorsList[0]!.hex;

    if (mode === "Event") {
      const eventData = eventInfo.event.extendedProps.eventData as EventWithSpaceName;
      return (
        <div
          className="flex h-full w-full flex-col gap-2 rounded border border-primary bg-primary/5 p-2 text-foreground"
          style={{
            backgroundColor: `${color}1A`, // 10% opacity in hex
            borderColor: color,
          }}
        >
          <Badge size={"xs"}>
            {eventData.facilityName ?? eventData.address ?? "No location"}
          </Badge>
          <p className="text-sm font-medium text-foreground">
            {eventData.title}
          </p>
          <Badge color="purple" size={"xs"}>
            {format(new Date(eventData.startTime), "HH:mm")} -{" "}
            {format(new Date(eventData.endTime), "HH:mm")}
          </Badge>
        </div>
      );
    } else {
      return (
        <div
          className="flex h-full w-full flex-col gap-2 rounded border border-primary bg-primary/5 p-2 text-foreground"
          style={{
            backgroundColor: `${color}1A`, // 10% opacity in hex
            borderColor: color,
          }}
        >
          <Badge size={"xs"}>
            {eventInfo.event.extendedProps.linkedAssetName}
          </Badge>
          <p className="text-sm font-medium text-foreground">
            {eventInfo.event.extendedProps.userName}
          </p>
          <Badge color="purple" size={"xs"}>
            {eventInfo.event.extendedProps.bottomText}
          </Badge>
        </div>
      );
    }
  };

  // Render the FullCalendar component
  return (
    <div className="flex h-screen w-full flex-col p-4">
      <FullCalendar
        height="100%"
        editable={true}
        eventContent={renderEventContent}
        timeZone="local"
        events={events}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        eventClick={handleEventClick}
        // eventDrop={handleEventDrop}
        dateClick={handleDateClick}
        ref={calendarRef}
        initialView="timeGridWeek"
        allDaySlot={false}
      />
    </div>
  );
}
