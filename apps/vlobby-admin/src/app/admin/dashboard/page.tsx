'use client';

import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import GlanceItemSummary from './_components/glance-item-summary';
import QuickActionMenu from './_components/quick-action-menu';
import UnderConstruction from '../_components/global-components/under-construction';
import { Card } from '@repo/ui/components/ui/card';
import Calendar from '../_components/calender/calender';
import {
  CustomPieChart,
  PieChartData,
} from '../_components/charts/custom-pie-chart';
import {
  RadialChart,
  RadialChartDataItem,
} from '../_components/charts/custom-radial-chart';
import { TableSkeleton } from '../_components/skeletons/table-loading-skeleton';
import { spaceRoleOptions } from '../../lib/app-data/static-data';

function DashboardContentLoader() {
  const issueTypeSummary = useQuery(
    api.tickets.issueStatusSummary
  ) as PieChartData[];
  const activeTicketsByFloor = useQuery(
    api.tickets.activeIssuesByFloor
  ) as PieChartData[];
  const issuePrioritySummary = useQuery(
    api.tickets.getActiveIssuesByPriority
  ) as RadialChartDataItem[];
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

  if (
    !issueTypeSummary ||
    !activeTicketsByFloor ||
    !issuePrioritySummary ||
    !spaceTypeData ||
    !occupancyData ||
    !formattedRoleFrequencies
  ) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-background p-2">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <GlanceItemSummary />
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex flex-row w-full gap-4">
              <CustomPieChart
                data={issueTypeSummary}
                title="Issues By Status"
                description="Distribution of issues across different statuses"
                totalLabel="Issues"
              />

              <CustomPieChart
                data={activeTicketsByFloor}
                title="Active Issues by Floor"
                description="Distribution of active issues across different floors"
                totalLabel="Active Issues"
              />
            </div>
            <div className="flex flex-row w-full">
              <RadialChart
                data={issuePrioritySummary}
                title="Active Issues by Priority"
                description="An overview of active issues by priority"
              />
            </div>
          </div>
        </div>
        <QuickActionMenu />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CustomPieChart
          data={spaceTypeData}
          title="Spaces By Type"
          description="Distribution of spaces across different categories"
          totalLabel="Spaces"
        />
        <RadialChart
          data={occupancyData}
          title={'Occupancy Overview'}
          description="An overview of occupancy rates across all spaces"
        />
        <CustomPieChart
          data={formattedRoleFrequencies}
          title="Space Role Frequencies"
          description="A breakdown of the different occupant roles in your spaces"
          totalLabel="Assigned Roles"
        />
      </div>

      <Card className="w-full p-4">
        <Calendar />
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <DashboardContentLoader />
    </div>
  );
}
