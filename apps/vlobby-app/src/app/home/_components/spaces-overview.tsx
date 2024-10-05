'use client';
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Space } from '../../../lib/app-types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Home, Users, Building, Layers, Power, Droplet } from 'lucide-react';
import { SpacesIconPath } from '../../../../public/svg/icons';
import { Badge } from '@tremor/react';
import { spaceRoleOptions } from '../../../lib/staticData';
import { Skeleton } from '@repo/ui/components/ui/skeleton';

const SpaceCard = ({ space }: { space: Space }) => (
  <Card className="flex flex-col w-full min-w-[380px] max-w-[450px]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-md font-medium">{space.spaceName}</CardTitle>
      <Badge size="xs">
        {spaceRoleOptions.find((option) => option.id === space.role)?.name ||
          space.role}
      </Badge>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{space.typeName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {space.totalUsersCount?.toString() ?? '0'} occupants
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{space.buildingName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Floor {space.floor}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Power className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Power: {space.powerMeterNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Water: {space.waterMeterNumber}</span>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Badge size="xs" color={space.accessibilityEnabled ? 'green' : 'red'}>
          {space.accessibilityEnabled ? 'Accessible' : 'Not Accessible'}
        </Badge>
        <Badge size="xs" color="gray">
          Title: {space.titleNumber}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

export function SpacesOverview() {
  const allSpaces = useQuery(api.spaces.getCurrentUserSpaces);

  if (!allSpaces) {
    return (
      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex flex-row gap-2 items-center mb-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
        <div className="flex gap-4 overflow-x-auto w-full">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className="w-80 h-40 rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <div className="flex flex-row gap-2 items-center justify-start">
        <div className="w-5 h-5 fill-foreground">
          <SpacesIconPath />
        </div>
        <h2 className="text-xl font-semibold">Spaces</h2>
        <Badge
          size="xs"
          color="purple"
        >{`Member of ${allSpaces.length} Spaces`}</Badge>
      </div>
      <div className="flex gap-4 flex-row w-full overflow-scroll">
        {allSpaces.map((space) => (
          <SpaceCard key={space._id} space={space} />
        ))}
      </div>
    </div>
  );
}
