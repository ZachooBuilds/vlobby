/**
 * PendingBooking Component
 * 
 * This component displays a pending booking and provides actions to approve or reject it.
 * It uses Convex for real-time data mutations and Tremor for UI components.
 */

import { useMutation } from "convex/react";
import { format } from "date-fns";
import { Badge } from "@tremor/react";
import { CheckIcon, XIcon } from "lucide-react";
import { BookingFormDataWithNames } from "../../../lib/app-data/app-types";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/components/ui/card";
import { FacilityIconPath } from "../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";

/**
 * @interface PendingBookingProps
 * @description Defines the props for the PendingBooking component
 * @property {BookingFormDataWithNames} booking - The booking data to display
 */
interface PendingBookingProps {
  booking: BookingFormDataWithNames;
}

/**
 * @function PendingBooking
 * @description Renders a card with pending booking details and approval/rejection actions
 * @param {PendingBookingProps} props - The component props
 * @returns {JSX.Element} The rendered PendingBooking component
 */
export function PendingBooking({ booking }: PendingBookingProps) {
  const { toast } = useToast();
  // Initialize the Convex mutation for updating booking status
  const setBookingStatus = useMutation(api.bookings.setBookingStatus);

  /**
   * @function handleStatusChange
   * @description Handles the approval or rejection of a booking
   * @param {string} status - The new status for the booking ("approved" or "rejected")
   */
  const handleStatusChange = async (status: "approved" | "rejected") => {
    try {
      // Call the Convex mutation to update the booking status
      await setBookingStatus({
        bookingId: booking._id as Id<"bookings">,
        status,
      });
      // Show a success toast notification
      toast({
        title: `Booking ${status}`,
        description: `The booking has been ${status}.`,
      });
    } catch (error) {
      console.error(`Error ${status} booking:`, error);
      // Show an error toast notification
      toast({
        title: "Error",
        description: `There was an error ${status} the booking. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <div className="h-4 w-4">
            <FacilityIconPath />
          </div>
          <p className="text-sm font-medium">{booking.facilityName}</p>
          <Badge size="xs" color="purple">
            {booking.status}
          </Badge>
          <Badge size="xs">{booking.bookingTypeName}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">{booking.userName}</p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(booking.date), "PPP")}
        </p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(booking.startTime), "p")} -{" "}
          {format(new Date(booking.endTime), "p")}
        </p>
        {booking.notes && (
          <p className="text-sm text-muted-foreground">{booking.notes}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-row gap-2">
        {/* Approve booking button */}
        <Button
          onClick={() => handleStatusChange("approved")}
          variant="ghost"
          className="text-green-500 hover:text-green-600"
        >
          <CheckIcon className="h-5 w-5" />
        </Button>
        {/* Reject booking button */}
        <Button
          onClick={() => handleStatusChange("rejected")}
          variant="ghost"
          className="text-red-500 hover:text-red-600"
        >
          <XIcon className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
