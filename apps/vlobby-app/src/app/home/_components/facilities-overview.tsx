import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Badge } from '@tremor/react';
import { FacilityIconPath } from '../../../../public/svg/icons';
import { Facility } from '../../../lib/app-types';

const FacilityCard = ({ facility }: { facility: Facility }) => (
  <Card className="relative h-48 w-36 rounded-lg overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: facility?.files[0]?.url
          ? `url(${facility.files[0].url})`
          : 'linear-gradient(to right, #1847ED, #00A3FF)',
      }}
    />
    <div className="absolute inset-0 bg-black bg-opacity-40" />
    <CardContent className="relative h-full flex flex-col justify-end p-4">
      <h3 className="text-white text-lg font-semibold">{facility.name}</h3>
    </CardContent>
  </Card>
);

export function FacilitiesOverview() {
  const allFacilities = useQuery(api.facilities.getAllFacilities);

  if (!allFacilities) {
    return <div>Loading facilities...</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <div className="flex flex-row gap-2 items-center justify-start">
        <div className="w-5 h-5 fill-foreground">
          <FacilityIconPath />
        </div>
        <h2 className="text-xl font-semibold">Facilities</h2>
        <Badge
          size="xs"
          color="purple"
        >{`${allFacilities.length} Available`}</Badge>
      </div>
      <div className="flex overflow-x-auto pb-4 w-full">
        <div className="flex gap-4">
          {allFacilities.map((facility) => (
            <FacilityCard facility={facility} />
          ))}
        </div>
      </div>
    </div>
  );
}
