'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import ViewSwitcher from '../_components/view-switcher';
import NavigationBarMaintenance from '../_components/navigation-maintenance';
import UnderConstructionMessage from '../_components/under-construction';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import {
  CustomPieChart,
  PieChartData,
} from '../_components/charts/custom-pie-chart';
import {
  RadialChart,
  RadialChartDataItem,
} from '../_components/charts/custom-radial-chart';
import { spaceRoleOptions } from '../../lib/staticData';

export default function SettingsPage() {
  // const spaces = useQuery(api.spaces.getAllSpaces);

  const spaceTypeData = useQuery(
    api.spaces.getTotalSpacesByType
  ) as PieChartData[];

  const occupancyData = useQuery(
    api.spaces.getOccupancy
  ) as RadialChartDataItem[];

  const roleFrequencies = useQuery(
    api.spaces.getRoleFrequencies
  ) as PieChartData[];

  const formattedRoleFrequencies = roleFrequencies?.map((role) => ({
    ...role,
    label:
      spaceRoleOptions.find((option) => option.id === role.label)?.name ??
      role.label,
  }));

  const isLoading =
    spaceTypeData === undefined ||
    occupancyData === undefined ||
    roleFrequencies === undefined;

  // If data is still loading, show the LoadingSpinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="w-full mb-4 w-full">
            <ViewSwitcher />
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CustomPieChart
              data={spaceTypeData}
              title="Spaces By Type"
              description="Distribution of spaces across different categories"
              totalLabel="Spaces"
            />
            <CustomPieChart
              data={formattedRoleFrequencies}
              title="Space Role Frequencies"
              description="A breakdown of the different occupant roles in your spaces"
              totalLabel="Assigned Roles"
            />
            <RadialChart
              data={occupancyData}
              title={'Occupancy Overview'}
              description="An overview of occupancy rates across all spaces"
            />
          </div>
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
