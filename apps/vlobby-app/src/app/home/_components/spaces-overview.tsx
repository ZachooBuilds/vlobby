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
import { Home, Users } from 'lucide-react';
import { Badge } from '@tremor/react';
import { SpacesIconPath } from '../../../../public/svg/icons';

const SpaceCard = ({ space }: { space: Space }) => (
  <Card className="flex flex-col w-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{space.spaceName}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <Home className="h-4 w-4 text-muted-foreground" />
        <Badge size="xs">{space.typeName}</Badge>
      </div>
      <div className="mt-2 flex items-center space-x-4">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {space.totalUsersCount?.toString() ?? '0'} occupants
        </span>
      </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {allSpaces.map((space) => (
          <SpaceCard key={space._id} space={space} />
        ))}
      </div>
    </div>
  );
}
