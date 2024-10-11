'use client';

import IssuesTable from './_table/issues-table';
import { useQuery } from 'convex/react';
import IssueUpsertForm from './_forms/issues-upsert-form';
import { TableSkeleton } from '../_components/skeletons/table-loading-skeleton';
import NoData from '../_components/global-components/no-data';
import { api } from '@repo/backend/convex/_generated/api';
import SectionHeader from '../_components/global-components/section-header';
import {
  CustomPieChart,
  PieChartData,
} from '../_components/charts/custom-pie-chart';
import {
  RadialChart,
  RadialChartDataItem,
} from '../_components/charts/custom-radial-chart';
import { IssueFormDataWithNames } from '../../lib/app-data/app-types';

/**
 * @function IssuesContentLoader
 * @description Handles the display of issues data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {IssueTableEntry[]} [props.issues] - Array of issue data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function IssuesContentLoader({
  issues,
  isLoading,
}: {
  issues?: IssueFormDataWithNames[];
  isLoading: boolean;
}) {
  const issueTypeSummary = useQuery(
    api.tickets.issueStatusSummary
  ) as PieChartData[];
  const issuePrioritySummary = useQuery(
    api.tickets.getActiveIssuesByPriority
  ) as RadialChartDataItem[];
  const activeTicketsByFloor = useQuery(
    api.tickets.activeIssuesByFloor
  ) as PieChartData[];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-background p-2">
        <TableSkeleton />
      </div>
    );
  }

  // No data found state
  if (!issues || issues.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="No issues reported?"
          title="No Issues"
          description="No issues have been reported yet. Add a new issue to get started."
          buttonText="Add Issue"
          formComponent={<IssueUpsertForm />}
          sheetTitle="Add New Issue"
          sheetDescription="Enter details to add a new issue"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CustomPieChart
          data={issueTypeSummary}
          title="Issues By Status"
          description="Distribution of issues across different statuses"
          totalLabel="Issues"
        />
        <RadialChart
          data={issuePrioritySummary}
          title="Active Issues by Priority"
          description="An overview of active issues by priority"
        />
        <CustomPieChart
          data={activeTicketsByFloor}
          title="Active Issues by Floor"
          description="Distribution of active issues across different floors"
          totalLabel="Active Issues"
        />
      </div>
      <IssuesTable data={issues} />
    </div>
  );
}

/**
 * @function IssuesPage
 * @description The main component for the Issues page
 * @returns {JSX.Element} The rendered IssuesPage component
 */
export default function IssuesPage() {
  const issues = useQuery(
    api.tickets.getAllIssuesWithNames
  ) as IssueFormDataWithNames[];

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Tickets"
        description="Manage and view all tickets for your site. You can add new issues, update existing ones, and track their status."
        buttonText="Lodge Ticket"
        sheetTitle="Lodge New Ticket"
        sheetDescription="Enter details to add a new ticket"
        sheetContent={'TicketUpsertForm'}
        icon={'Ticket'}
      />
      <IssuesContentLoader issues={issues} isLoading={issues === undefined} />
    </div>
  );
}
