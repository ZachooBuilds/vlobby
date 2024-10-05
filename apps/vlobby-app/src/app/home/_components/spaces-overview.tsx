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
import {
  Home,
  Users,
  Building,
  Layers,
  Power,
  Droplet,
  FileText,
  AccessibilityIcon,
} from 'lucide-react';
import { SpacesIconPath } from '../../../../public/svg/icons';
import { Badge } from '@tremor/react';
import { spaceRoleOptions } from '../../../lib/staticData';

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
      {/* <div className="mt-4 flex flex-row gap-2">
        <Badge
          size="xs"
          color={space.accessibilityEnabled ? 'green' : 'red'}
          className="flex flex-row items-center gap-2"
        >
          <AccessibilityIcon className="h-3 w-3" />
          <span>
            {space.accessibilityEnabled ? 'Accessible' : 'Not Accessible'}
          </span>
        </Badge>
        <Badge
          color="gray"
          size="xs"
          className="flex flex-row items-center gap-2"
        >
          <FileText className="h-3 w-3" />
          <span>Title: {space.titleNumber}</span>
        </Badge>
      </div> */}
    </CardContent>
  </Card>
);

export function SpacesOverview() {
  const allSpaces = useQuery(api.spaces.getCurrentUserSpaces);

  if (!allSpaces) {
    return <div>Loading spaces...</div>;
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
