"use client";

import { useQuery } from "convex/react";
import { PendingBooking } from "./_components/pending-booking";
import { ClockIcon } from "lucide-react";
import { Badge } from "@tremor/react";
import { api } from "@repo/backend/convex/_generated/api";
import { BookingFormDataWithNames, CalenderEvent } from "../../lib/app-data/app-types";
import SectionHeader from "../_components/global-components/section-header";
import Calendar from "../_components/calender/calender";

/**
 * BookingsPage Component
 * 
 * This component renders the main bookings page, displaying pending bookings
 * and a calendar view of approved bookings.
 *
 * @returns {JSX.Element} The rendered BookingsPage component
 */
export default function BookingsPage() {
  // Fetch all bookings with details using Convex query
  const bookings = useQuery(
    api.bookings.getAllBookingsWithDetails,
  ) as BookingFormDataWithNames[];

  // Filter pending bookings
  const pendingBookings = bookings?.filter(
    (booking) => booking.status === "pending",
  );

  // Process all bookings, converting date strings to Date objects
  const allBookings = bookings?.map((booking) => ({
    ...booking,
    slots: booking.slots.map((slot: { slotIndex: number; slotTime: Date }) => ({
      slotIndex: slot.slotIndex,
      slotTime: new Date(slot.slotTime),
    })),
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
    date: new Date(booking.date),
  })) as BookingFormDataWithNames[];

  // Filter approved bookings
  const approvedBookings = allBookings?.filter(
    (booking) => booking.status === "approved",
  );

  // Format approved bookings for calendar display
  const formattedBookings: CalenderEvent[] =
    approvedBookings?.map((booking) => ({
      id: booking._id!,
      title: booking.bookingTypeName,
      start: new Date(booking.startTime),
      end: new Date(booking.endTime),
      date: new Date(booking.date),
      extendedProps: {
        linkedAssetId: booking.facilityId,
        linkedAssetName: booking.facilityName,
        userName: booking.userName,
        bottomText: booking.bookingTypeName,
        bookingData: booking,
      },
    })) ?? [];

  console.log("formatted bookings", formattedBookings);

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      {/* Section header with title, description, and new booking button */}
      <SectionHeader
        title="Bookings"
        description="Manage facility bookings for your building. You can create new bookings, view existing ones, and set up recurring reservations for various amenities and spaces."
        buttonText="New Booking"
        sheetTitle="Create Booking"
        sheetDescription="Create a new booking for a facility"
        sheetContent={"BookingUpsertForm"}
        icon={"Booking"}
      />
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-4">
        {/* Pending Bookings Section */}
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-normal">Pending Bookings</p>
          <Badge size="xs">{pendingBookings?.length} Pending</Badge>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingBookings?.map((booking) => (
            <PendingBooking key={booking._id} booking={booking} />
          ))}
        </div>
        {/* Calendar view of approved bookings */}
        <Calendar
          events={formattedBookings}
          mode="Booking"
        />
      </div>
    </div>
  );
}
