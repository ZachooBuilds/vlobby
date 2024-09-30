'use client';
/**
 * @file WorkOrdersPage Component
 * @description This component provides the main page for managing work orders.
 * It includes a section header, a table to display work orders, and handles
 * loading and no-data states.
 */
import { useQuery } from 'convex/react';
import WorkOrderUpsertForm from './_forms/work-order-upsert-form';
import WorkOrdersTable from './_table/work-orders-table';
import { WorkOrderFormDataWithNames } from '../../lib/app-data/app-types';
import { TableSkeleton } from '../_components/skeletons/table-loading-skeleton';
import NoData from '../_components/global-components/no-data';
import { api } from '@repo/backend/convex/_generated/api';
import SectionHeader from '../_components/global-components/section-header';
/**
 * @function WorkOrdersContentLoader
 * @description Handles the display of work orders data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {WorkOrderFormDataWithNames[]} [props.workOrders] - Array of work order data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function WorkOrdersContentLoader({
  workOrders,
  isLoading,
}: {
  workOrders?: WorkOrderFormDataWithNames[];
  isLoading: boolean;
}) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-background p-2">
        <TableSkeleton />
      </div>
    );
  }

  // No data found state
  if (!workOrders || workOrders.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="No work orders?"
          title="No Work Orders"
          description="No work orders have been created yet. Add a new work order to get started."
          buttonText="Add Work Order"
          formComponent={<WorkOrderUpsertForm />}
          sheetTitle="Add New Work Order"
          sheetDescription="Enter details to add a new work order"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <WorkOrdersTable data={workOrders} />
    </div>
  );
}

/**
 * @function WorkOrdersPage
 * @description The main component for the Work Orders page
 * @returns {JSX.Element} The rendered WorkOrdersPage component
 */
export default function WorkOrdersPage() {
  // Fetch work orders data using Convex query
  const workOrders = useQuery(
    api.workOrders.getAllWorkOrdersWithNames
  ) as WorkOrderFormDataWithNames[];

  console.log(workOrders);

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Work Orders"
        description="Manage and view all work orders for your site. You can add new work orders, update existing ones, and track their status."
        buttonText="Create Work Order"
        sheetTitle="Create New Work Order"
        sheetDescription="Enter details to create a new work order"
        sheetContent={'WorkOrderUpsertForm'}
        icon={'WorkOrder'}
      />
      <WorkOrdersContentLoader
        workOrders={workOrders}
        isLoading={workOrders === undefined}
      />
    </div>
  );
}
