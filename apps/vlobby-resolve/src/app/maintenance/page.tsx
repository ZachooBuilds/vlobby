'use client';

import React, { useState } from 'react';
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
import { Skeleton } from '@repo/ui/components/ui/skeleton';

export default function SettingsPage() {
  // const spaces = useQuery(api.spaces.getAllSpaces);

  const [isLoading, setIsLoading] = useState(true);

  const spaceTypeData = useQuery(
    api.spaces.getTotalSpacesByType
  ) as PieChartData[];

  const occupancyData = useQuery(
    api.spaces.getOccupancy
  ) as RadialChartDataItem[];

  const roleFrequencies = useQuery(
    api.spaces.getRoleFrequencies
  ) as PieChartData[];

  const issueTypeSummary = useQuery(
    api.tickets.issueStatusSummary
  ) as PieChartData[];
  const issuePrioritySummary = useQuery(
    api.tickets.getActiveIssuesByPriority
  ) as RadialChartDataItem[];
  const activeTicketsByFloor = useQuery(
    api.tickets.activeIssuesByFloor
  ) as PieChartData[];

  const formattedRoleFrequencies = roleFrequencies?.map((role) => ({
    ...role,
    label:
      spaceRoleOptions.find((option) => option.id === role.label)?.name ??
      role.label,
  }));

  // If data is still loading, show the LoadingSpinner
  if (
    !spaceTypeData ||
    !occupancyData ||
    !roleFrequencies ||
    !issueTypeSummary ||
    !activeTicketsByFloor ||
    !issuePrioritySummary
  ) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 p-4 pt-16 pb-[120px]">
          <ViewSwitcher />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <CustomPieChart
                data={spaceTypeData}
                title="Spaces By Type"
                description="Distribution of spaces across different categories"
                totalLabel="Spaces"
              />
              <CustomPieChart
                data={issueTypeSummary}
                title="Issues By Status"
                description="Distribution of issues across different statuses"
                totalLabel="Issues"
              />
            </div>
            <RadialChart
              data={occupancyData}
              title={'Occupancy Overview'}
              description="An overview of occupancy rates across all spaces"
            />
            <div className="flex flex-row gap-2">
              <CustomPieChart
                data={formattedRoleFrequencies}
                title="Space Role Frequencies"
                description="A breakdown of the different occupant roles in your spaces"
                totalLabel="Assigned Roles"
              />
              <CustomPieChart
                data={activeTicketsByFloor}
                title="Active Issues by Floor"
                description="Distribution of active issues across different floors"
                totalLabel="Active Issues"
              />
            </div>
            <RadialChart
              data={issuePrioritySummary}
              title="Active Issues by Priority"
              description="An overview of active issues by priority"
            />
          </div>
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 p-4 pt-16 pb-[120px]">
          <ViewSwitcher />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <Skeleton className="w-full h-[200px] rounded-md" />
              <Skeleton className="w-full h-[200px] rounded-md" />
            </div>
            <Skeleton className="w-full h-[250px] rounded-md" />
            <div className="flex flex-row gap-2">
              <Skeleton className="w-full h-[200px] rounded-md" />
              <Skeleton className="w-full h-[200px] rounded-md" />
            </div>
            <Skeleton className="w-full h-[250px] rounded-md" />
          </div>
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}
