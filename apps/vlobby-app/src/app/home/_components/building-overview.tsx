import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Building, ImageUrlAndId } from '../../../lib/app-types';
import { BuildingIconPath } from '../../../../public/svg/icons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

interface BuildingOverviewProps {
  buildings: Building[] | undefined;
}

export function BuildingOverview({ buildings }: BuildingOverviewProps) {
  const { user } = useUser();
  const bannerImage = useQuery(api.theme.getBannerImage);

  return (
    <Card
      className={`flex w-full flex-col min-h-[150px] p-2 ${!bannerImage?.url ? 'bg-white' : ''}`}
      style={
        bannerImage?.url
          ? {
              backgroundImage: `url(${bannerImage.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      <CardHeader>
        <CardTitle
          className={cn(
            'text-xl',
            bannerImage?.url ? 'text-white' : 'text-black'
          )}
        >
          Welcome back, {user?.firstName}
        </CardTitle>
        <CardDescription>
          <div className="flex flex-row gap-2 w-full">
            <div
              className={`w-4 h-4 ${bannerImage?.url ? 'fill-white' : 'fill-black'} font-bold`}
            >
              <BuildingIconPath />
            </div>
            <BuildingInfo
              buildings={buildings}
              textColor={bannerImage?.url ? 'text-white' : 'text-black'}
            />
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function BuildingInfo({
  buildings,
  textColor,
}: {
  buildings: Building[] | undefined;
  textColor: string;
}) {
  if (buildings === undefined) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <p className={textColor}>Gathering building information...</p>
      </div>
    );
  }

  return (
    <p className={textColor}>
      {buildings && buildings.length > 0
        ? buildings[0]?.name
        : 'No Building Connected'}
    </p>
  );
}
