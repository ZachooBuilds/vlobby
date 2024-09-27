"use client";
import React from "react";

import { CalendarDays, Clock, Users } from "lucide-react";

import { BookingTypeFormData } from "../_forms/booking-type-validation";
import { Badge } from "@tremor/react";

import UpsertBookingTypeForm from "../_forms/upsert-booking-type";
import { FacilityFormData } from "../../_forms/facility-validation";
import useSheetStore from "../../../../lib/global-state/sheet-state";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

// Define the properties for the BookingTypesOverview component
type Props = {
  bookingType: BookingTypeFormData;
  facility: FacilityFormData;
};

export default function BookingTypesOverview({ bookingType, facility }: Props) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openSheet = useSheetStore((state) => state.openSheet);
  

  const handleEditType = () => {
    openSheet(
      "Add Booking Type",
      "Use the options below to configure a new booking types for this facility.",
      <UpsertBookingTypeForm
        buildingId={facility.buildingId}
        facilityId={facility._id ?? ""}
        selectedType={bookingType}
      />,
    );
  };

  return (
    <Card className="flex w-full flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          {bookingType.name}
        </CardTitle>
        <Badge
          size={"xs"}
          color={bookingType.status === "status:active" ? "green" : "red"}
        >
          {bookingType.status === "status:active" ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">
            {formatDate(bookingType.startTime)} -{" "}
            {formatDate(bookingType.endTime)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">
            {bookingType.avalibleDays.map((day) => day.label).join(", ")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">
            {bookingType.audience ? bookingType.audience.length : 0} audience
            groups
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleEditType}
          type="button"
        >
          View/Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
