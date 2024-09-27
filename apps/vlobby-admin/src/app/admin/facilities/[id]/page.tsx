"use client";
import React from "react";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { FacilityFormData } from "../_forms/facility-validation";
import FacilityUpsertForm from "../_forms/facility-upsert-form";
import FacilitiesOverview from "./_components/facility-overview";
import UpsertBookingTypeForm from "./_forms/upsert-booking-type";
import BookingTypesOverview from "./_components/booking-types-overview";
import BookingUpsertForm from "../../bookings/_forms/booking-upsert-form";
import { BookingTypeFormData } from "./_forms/booking-type-validation";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { api } from "@repo/backend/convex/_generated/api";
import { BookingFormDataWithNames, CalenderEvent, FacilityFormDataWithNames } from "../../../lib/app-data/app-types";
import DetailsHeader from "../../_components/global-components/page-header";
import { FacilityIconPath } from "../../../lib/icons/icons";
import SmartLock from "../../_components/global-components/device-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import Calendar from "../../_components/calender/calender";
import UnderConstructionMessage from "../../_components/global-components/under-construction";
import NoData from "../../_components/global-components/no-data";

type FacilityDetailsPageProps = {
  params: { id: string };
};

// Function to fetch and format all necessary data
function useFacilityData(facilityId: Id<"facilities">) {
  const facility = useQuery(api.facilities.getFacility, {
    _id: facilityId,
  }) as FacilityFormDataWithNames;

  const rawFacilityBookings = useQuery(api.bookings.getBookingsByFacilityId, {
    facilityId,
  }) as BookingFormDataWithNames[];

  const bookingTypes = useQuery(api.bookingTypes.getBookingTypesForFacility, {
    facilityId,
  }) as BookingTypeFormData[];

  const isLoading = [facility, rawFacilityBookings, bookingTypes].some(
    (data) => data === undefined,
  );

  const facilityBookings = rawFacilityBookings?.map((booking) => ({
    ...booking,
    slots: booking.slots.map(
      (slot: { slotIndex: number; slotTime: Date }) => ({
        slotIndex: slot.slotIndex,
        slotTime: new Date(slot.slotTime),
      }),
    ),
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
    date: new Date(booking.date),
  })) as BookingFormDataWithNames[];

  const formattedBookings: CalenderEvent[] =
    facilityBookings?.map((booking) => ({
      id: booking._id!,
      title: booking.bookingTypeName,
      start: booking.startTime,
      end: booking.endTime,
      date: booking.startTime,
      extendedProps: {
        linkedAssetId: facility._id ?? "",
        linkedAssetName: facility.name,
        userName: booking.userName,
        bottomText: booking.bookingTypeName,
        bookingData: booking,
      },
    })) ?? [];

  return {
    facility,
    facilityBookings,
    bookingTypes,
    formattedBookings,
    isLoading,
  };
}

export default function FacilityDetailsPage({
  params,
}: FacilityDetailsPageProps) {
  const facilityId = params.id as Id<"facilities">;
  const { facility, formattedBookings, bookingTypes, isLoading } =
    useFacilityData(facilityId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-row items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <p>Collecting facility data ...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <DetailsHeader
        title={facility.name}
        description={facility.description ?? " "}
        icon={<FacilityIconPath />}
        FormComponent={<FacilityUpsertForm selectedFacility={facility} />}
      />
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="w-full md:w-2/3">
            <FacilitiesOverview facility={facility} />
          </div>
          <div className="w-full md:w-1/3">
            <SmartLock deviceId={""} />
          </div>
        </div>

        <Tabs defaultValue="bookings" className="mt-4 w-full">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="access">Access Logs</TabsTrigger>
            <TabsTrigger value="settings">Booking Settings</TabsTrigger>
          </TabsList>

          <BookingsTab
            facility={facility}
            formattedBookings={formattedBookings}
          />
          <AccessTab />
          <SettingsTab facility={facility} bookingTypes={bookingTypes} />
        </Tabs>
      </div>
    </div>
  );
}

function BookingsTab({
  facility,
  formattedBookings,
}: {
  facility: FacilityFormDataWithNames;
  formattedBookings: CalenderEvent[];
}) {
  const openSheet = useSheetStore((state) => state.openSheet);

  const handleAddBooking = () => {
    openSheet(
      "Add New Booking",
      "Use the options below to add a new booking to this facility.",
      <BookingUpsertForm selectedFacility={facility} />,
    );
  };

  return (
    <TabsContent value="bookings">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Bookings</CardTitle>
          <Button onClick={handleAddBooking} variant={"outline"}>
            New booking
          </Button>
        </CardHeader>
        <CardContent>
          <Calendar
            events={formattedBookings}
            mode="facility"
            selectedFacility={facility}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function AccessTab() {
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

function SettingsTab({
  facility,
  bookingTypes,
}: {
  facility: FacilityFormData;
  bookingTypes: BookingTypeFormData[];
}) {
  const openSheet = useSheetStore((state) => state.openSheet);

  const handleAddBookingType = () => {
    openSheet(
      "Add Booking Type",
      "Use the options below to configure a new booking types for this facility.",
      <UpsertBookingTypeForm
        buildingId={facility.buildingId}
        facilityId={facility._id ?? ""}
      />,
    );
  };

  if (bookingTypes.length === 0) {
    return (
      <TabsContent value="settings">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-medium">Booking Types</CardTitle>
            <Button onClick={handleAddBookingType} variant={"outline"}>
              Configure New Type
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NoData
              badgeText={"We cant find anything here !"}
              title={"No booking types configured"}
              description={
                "No booking types have been configures for this facility. Currently occupants can only view the detials and cannont make bookings."
              }
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="settings">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Notes</CardTitle>
          <Button onClick={handleAddBookingType} variant={"outline"}>
            Configure New Type
          </Button>
        </CardHeader>
        <CardContent className="grid-col-1 grid gap-4 lg:grid-cols-2 ">
          {bookingTypes.map((bookingType, index) => (
            <BookingTypesOverview
              key={index}
              bookingType={bookingType}
              facility={facility}
            />
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
