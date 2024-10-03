'use client';
import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@repo/ui/components/ui/card';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { EventDetails } from '../../../lib/app-types';
import { format } from 'date-fns';
import { Badge } from '@tremor/react';


interface EventCardProps {
  event: EventDetails;
}

export default function EventCard({ event }: EventCardProps) {
  console.log('event', event);

  const renderAttendanceBadge = () => {
    if (event.isAttending) {
      if (event.attendeeCount && event.attendeeCount > 1) {
        return (
          <Badge >
            You're going with {event.attendeeCount - 1} others
          </Badge>
        );
      }
      return <Badge >You're going</Badge>;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={
            event.files?.[0] ??
            'https://utfs.io/f/7c385290-0f9e-486b-a61e-1ae97d2bd8b5-9w6i5v.webp'
          }
          alt={event.title}
          fill
          className="object-cover"
          unoptimized
        />
      </AspectRatio>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          {renderAttendanceBadge()}
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.startTime), 'PPP')}
        </p>
      </CardContent>
    </Card>
  );
}
