'use client';

import React from 'react';
import NavigationBar from '../_components/navigation';
import { FacilityIconPath } from '../../../public/svg/icons';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { BookingDetails, FacilityOverview } from '../../lib/app-types';
import NoData from '../_components/no-data';
import FacilityCard from './_components/facility-card';
import { Loader2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import { BookingOverview } from './_components/booking-overview';

export default function FacilitiesPage() {
  const facilities = useQuery(api.facilities.getAllOccupantFacilities);
  const occupantBookings = useQuery(
    api.bookings.getAllBookingsWithDetailsForCurrentOccupant
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <FacilityIconPath />
            </div>
            <h2 className="text-xl font-semibold">Facilities</h2>
          </div>
          <FacilitiesContentLoader
            facilities={facilities}
            bookings={occupantBookings}
            isLoading={
              facilities === undefined || occupantBookings === undefined
            }
          />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}

function FacilitiesContentLoader({
  facilities,
  bookings,
  isLoading,
}: {
  facilities?: FacilityOverview[];
  bookings?: BookingDetails[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    (!facilities || facilities.length === 0) &&
    (!bookings || bookings.length === 0)
  ) {
    return (
      <NoData
        badgeText="No data available"
        title="No Facilities or Bookings"
        description="No facilities or bookings have been added yet."
      />
    );
  }

  return (
    <Tabs defaultValue="facilities" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="facilities" className="w-full">
          Facilities
        </TabsTrigger>
        <TabsTrigger value="bookings" className="w-full">
          Bookings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="facilities">
        {facilities && facilities.length > 0 ? (
          <div className="grid w-full grid-cols-1 items-start justify-start gap-2 rounded-lg bg-background md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <FacilityCard facility={facility} key={facility._id} />
            ))}
          </div>
        ) : (
          <NoData
            badgeText="Where are your facilities?"
            title="No Facilities"
            description="No facilities have been added yet. Add a new facility to get started."
          />
        )}
      </TabsContent>
      <TabsContent value="bookings">
        {bookings && bookings.length > 0 ? (
          <div className="grid w-full grid-cols-1 items-start justify-start gap-4 rounded-lg bg-background md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingOverview booking={booking} key={booking._id} />
            ))}
          </div>
        ) : (
          <NoData
            badgeText="No bookings found"
            title="No Bookings"
            description="You haven't made any bookings yet."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
