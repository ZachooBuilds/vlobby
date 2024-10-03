import React, { useState } from 'react';
import { api } from '@repo/backend/convex/_generated/api';
import { ParcelData } from '../../../lib/app-types';
import { Card, CardContent, CardHeader } from '@repo/ui/components/ui/card';
import { Badge } from '@tremor/react';
import { ParcelIconPath } from '../../../../public/svg/icons';
import { useQuery } from 'convex/react';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../../lib/global-state';
import { format } from 'date-fns';
import { parcelTypeOptions } from '../../../lib/staticData';
import { Text } from 'lucide-react';

const MailCard = ({ parcel }: { parcel: ParcelData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const parcelType =
    parcelTypeOptions.find((option) => option.value === parcel.parcelTypeId) ||
    parcelTypeOptions.find((option) => option.value === 'other');

  const Icon = parcelType?.icon;

  return (
    <Card
      className="flex flex-col w-full cursor-pointer"
      onClick={toggleExpand}
    >
      <CardHeader className="flex flex-col space-y-2 pb-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <Badge size="sm" color="indigo">
              {parcelType?.label || parcel.parcelTypeId}
            </Badge>
          </div>
          <Badge color="indigo">
            {parcel.numPackages} {parcel.numPackages === 1 ? 'Item' : 'Items'}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {parcel._creationTime
            ? format(new Date(parcel._creationTime), 'PPp')
            : 'Time not available'}
        </span>
      </CardHeader>
      {isExpanded && (
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Text className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {parcel.description}
            </span>
          </div>
          <Badge size="xs" color="pink">
            {parcel.spaceName}
          </Badge>
        </CardContent>
      )}
    </Card>
  );
};

export function MailOverview() {
  const allMail = useQuery(api.parcels.getAllForCurrentOccupant, {
    isCollected: false,
  });
  const { openDrawer } = useDrawerStore();

  if (!allMail) {
    return <div>Catching the postman ...</div>;
  }

  const handleScheduleCollection = () => {
    openDrawer(
      'Schedule Collection',
      'Choose a time to collect your mail and parcels.',
      <div>
        {/* Add your scheduling form or content here */}
        <Button>Schedule Collection</Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <ParcelIconPath />
            </div>
            <h2 className="text-xl font-semibold">Mailbox</h2>
            <Badge
              size="xs"
              color="purple"
            >{`${allMail.length} To Collect`}</Badge>
          </div>
          <Button variant="outline" onClick={handleScheduleCollection}>
            Collect
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {allMail.map((mail) => (
          <MailCard key={mail._id} parcel={mail} />
        ))}
      </div>
    </div>
  );
}
