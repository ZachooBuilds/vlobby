'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { BookingDetails } from '../../../lib/app-types';
import { format } from 'date-fns';
import { Badge } from '@tremor/react';

interface BookingOverviewProps {
  booking: BookingDetails;
}

export function BookingOverview({ booking }: BookingOverviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-md font-medium flex flex-row justify-between">
          <span> {booking.facilityName} Booking </span>
          <Badge
            size="sm"
            color={
              booking.status === 'approved'
                ? 'green'
                : booking.status === 'pending'
                  ? 'orange'
                  : 'red'
            }
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </CardTitle>
        <span className="text-sm">
          {format(new Date(booking.startTime), 'EEEE do MMMM h:mma')} -
          {format(new Date(booking.endTime), 'h:mma')}
        </span>
      </CardHeader>
      <CardContent>
        <Badge color="purple" size="xs">
          Booking Type: {booking.bookingTypeName}
        </Badge>
      </CardContent>
    </Card>
  );
}
