"use client";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import AttendeeUpsertForm from "../../_forms/attendee-upsert";
import { Badge } from "@tremor/react";
import { useRouter } from "next/navigation";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import useModalStore from "../../../../lib/global-state/modal-state";
import { api } from "@repo/backend/convex/_generated/api";
import { EventAttendeeWithOccupantDetails } from "../../../../lib/app-data/app-types";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { OccupantsIconPath } from "../../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

/**
 * @interface AttendeesSummaryProps
 * @description Defines the props for the AttendeesSummary component
 */
interface AttendeesSummaryProps {
  eventId: Id<"events">;
}

/**
 * @function AttendeesSummary
 * @description Renders a summary of attendees for a specific event
 * @param {AttendeesSummaryProps} props - The component props
 * @returns {JSX.Element} The rendered AttendeesSummary component
 */
const AttendeesSummary = ({ eventId }: AttendeesSummaryProps) => {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  // Fetch all attendees for the event from the database
  const attendees = useQuery(api.eventAttendees.getAttendeesForEvent, {
    eventId,
  }) as EventAttendeeWithOccupantDetails[];

  /**
   * @function handleAttendeeClick
   * @description Handles the click event on an attendee
   * @param {EventAttendeeWithOccupantDetails} attendee - The clicked attendee
   */
  const handleAttendeeClick = (attendee: EventAttendeeWithOccupantDetails) => {
    // You might want to implement a different action here,
    // such as opening a modal to edit the attendee details
    console.log("Attendee clicked:", attendee);
  };

  const handleAddAttendee = () => {
    openModal(
      "Add Attendee",
      "Add a new attendee to the event",
      <AttendeeUpsertForm eventId={eventId} />,
    );
  };

  return (
    <Card className="h-full p-0">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {OccupantsIconPath()}
          </svg>
          Attendees
        </CardTitle>
        <Button variant="outline" size="icon" onClick={handleAddAttendee}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-2 pt-0">
        {/* Loading state */}
        {attendees == undefined && (
          <div key={"loading-attendee"} className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
            <div className="flex-grow">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          </div>
        )}

        {/* Empty state */}
        {attendees && attendees.length === 0 && (
          <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
            ✋ No attendees added yet.
          </div>
        )}

        {attendees?.map((attendee) => (
          <div
            key={attendee._id}
            className="flex cursor-pointer flex-row items-center gap-4 rounded-md p-2 transition-colors hover:bg-muted"
            onClick={() => handleAttendeeClick(attendee)}
          >
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-muted text-lg text-primary">
                {attendee.isOccupant
                  ? attendee.occupantName.charAt(0) || "OC"
                  : `${attendee.firstName?.[0] ?? ""}${attendee.lastName?.[0] ?? ""}`}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full flex-col items-start justify-start gap-2">
              <div className="text-sm font-medium">
                {attendee.isOccupant
                  ? attendee.occupantName
                  : `${attendee.firstName} ${attendee.lastName}`}
              </div>

              <div className="text-sm text-muted-foreground">
                {attendee.isOccupant ? attendee.occupantEmail : attendee.email}
              </div>
              <div className="text-sm text-muted-foreground">
                Number of Attendees: {attendee.numberOfAttendees}
              </div>
              <Badge size="xs">
                {attendee.isOccupant ? "Occupant" : "Other"}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AttendeesSummary;
