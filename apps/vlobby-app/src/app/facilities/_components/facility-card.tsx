'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { Button } from '@repo/ui/components/ui/button';
import { FacilityOverview } from '../../../lib/app-types';
import useDrawerStore from '../../../lib/global-state';
import BookingUpsertForm from '../_forms/booking-upsert-form';

// Define the properties for the AssetsCard component
interface FacilityCardProps {
  facility: FacilityOverview;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const { openDrawer } = useDrawerStore();

  const handleAddBooking = () => {
    openDrawer(
      'Book Facility',
      'Chosse an avalible slot and confirm booking',
      <BookingUpsertForm selectedFacility={facility} />
    );
  };

  return (
    <Card className="flex h-full flex-col justify-start gap-2 p-2 dark:border-none">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={
            facility.files[0]?.url ??
            'https://utfs.io/f/7c385290-0f9e-486b-a61e-1ae97d2bd8b5-9w6i5v.webp'
          }
          alt={facility.name}
          fill
          className="rounded-md object-cover"
          unoptimized
        />
      </AspectRatio>
      {/* To Do : Aadd setting to add facility status types with colours and a boolean for accepts bookings */}

      <div className="flex h-full flex-col items-start justify-start gap-2">
        <CardTitle className="text-md font-medium">{facility.name}</CardTitle>
        <CardDescription>{facility.description}</CardDescription>
      </div>
      {/* To Do: add booking capacity calculation  */}
      {/* <ProgressBar
        value={(slotsOccupied / slotsTotal) * 100}
        label={`${(slotsOccupied / slotsTotal) * 100}%`}
        className="w-full"
        color={badgeColor as "red" | "blue" | "green" | "orange"}
      /> */}
      <CardFooter className="flex w-full flex-col items-start justify-between gap-2 p-2">
        <p className="text-sm text-muted-foreground">Booking Capacity</p>
        <Button
          variant={'secondary'}
          onClick={handleAddBooking}
          className="w-full"
        >
          Book Facility
        </Button>
      </CardFooter>
    </Card>
  );
}
