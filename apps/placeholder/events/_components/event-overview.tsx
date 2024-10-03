/**
 * @file EventOverview Component
 * @description Displays detailed information about a specific event
 */
'use client';
import { ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@tremor/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@repo/ui/components/ui/card';
import Tiptap from '@repo/ui/components/custom-form-fields/rich-editor';
import { EventIconPath } from '../../../../public/svg/icons';
import { EventDetails } from '../../../lib/app-types';
import ImageGalleryComponent from '../../_components/image-gallery';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../../lib/global-state';
import AttendeeUpsertForm from '../_forms/attendee-upsert';

/**
 * Props for the EventOverview component
 */
interface EventOverviewProps {
  event: EventDetails;
}

/**
 * EventOverview component for displaying comprehensive information about an event
 * @param {EventOverviewProps} props - The component props
 * @returns {JSX.Element} The rendered EventOverview component
 */
const EventOverview = ({ event }: EventOverviewProps) => {
  const [key, setKey] = useState(0);
  const { openDrawer } = useDrawerStore();

  useEffect(() => {
    // Force re-render of Tiptap when event changes
    setKey((prevKey) => prevKey + 1);
  }, [event]);

  const handleAttendEvent = () => {
    openDrawer(
      'Attend Event',
      'Confirm your attendance for this event',
      <AttendeeUpsertForm eventId={event._id} />
    );
  };

  console.log('event', event);
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <div className="h-4 w-4">
            <EventIconPath />
          </div>
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid layout for event details */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* Date */}
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-sm">{format(event.startTime, 'MMMM d, yyyy')}</p>
          </div>
          {/* Time */}
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="flex items-center gap-1 text-sm">
              <ClockIcon className="h-4 w-4" />
              {format(event.startTime, 'h:mm a')} -{' '}
              {format(event.endTime, 'h:mm a')}
            </p>
          </div>
          {/* Location */}
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="flex items-center gap-1 text-sm">
              <MapPinIcon className="h-4 w-4" />
              {event.facilityName}
            </p>
          </div>
          {/* Capacity */}
          <div>
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="flex items-center gap-1 text-sm">
              <UsersIcon className="h-4 w-4" />
              {event.capacity}
            </p>
          </div>
          {/* Public/Private */}
          <div>
            <p className="text-sm text-muted-foreground">Access</p>
            <Badge color={event.isPublicPlace ? 'green' : 'blue'} size="xs">
              {event.isPublicPlace ? 'Public' : 'Private'}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <Tiptap
            initialContent={event.description}
            isViewer={true}
            key={key} // Use the key state instead of event._id
          />
        </div>

        {/* Audience */}
        {event.audience && event.audience.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">Audience</p>
            <div className="flex flex-wrap gap-2">
              {event.audience.map((item, index) => (
                <Badge key={index} size="xs">
                  {item.type}: {item.entity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <div>
          <ImageGalleryComponent images={event.files ?? []} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAttendEvent}>Attend Event</Button>
      </CardFooter>
    </Card>
  );
};

export default EventOverview;
