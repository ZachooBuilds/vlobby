"use client";
/**
 * @file StoragePage Component
 * @description This component provides the main page for managing storage items.
 * It includes a section header, a table to display storage items, and handles
 * loading and no-data states.
 */
import { useQuery } from "convex/react";
import StorageUpsertForm from "./_forms/storage-upsert-form";
import StorageTable from "./_table/storage-table";
import { StorageSummaryTableData } from "../../lib/app-data/app-types";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function StorageContentLoader
 * @description Handles the display of storage data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {StorageItemFormData[]} [props.storageItems] - Array of storage item data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function StorageContentLoader({
  storageItems,
  isLoading,
}: {
  storageItems?: StorageSummaryTableData[];
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
  if (!storageItems || storageItems.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your storage items?"
          title="No Storage Items"
          description="No storage items have been added yet. Add a new item to get started."
          buttonText="Add Storage Item"
          formComponent={<StorageUpsertForm />}
          sheetTitle="Add New Storage Item"
          sheetDescription="Enter details to add a new storage item"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <StorageTable data={storageItems} />
    </div>
  );
}

/**
 * @function StoragePage
 * @description The main component for the Storage page
 * @returns {JSX.Element} The rendered StoragePage component
 */
export default function StoragePage() {
  // Fetch storage items data using Convex query
  const storageItems = useQuery(
    api.storageSpaces.getAll,
  ) as StorageSummaryTableData[];

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Storage"
        description="Manage and view all storage items for your property. You can add new items, update existing ones, and track their location and status."
        buttonText="Add Storage Space"
        sheetTitle="Add New Storage Space"
        sheetDescription="Enter details to add a new storage space"
        sheetContent={"StorageUpsertForm"}
        icon={"Storage"}
      />
      <StorageContentLoader
        storageItems={storageItems}
        isLoading={storageItems === undefined}
      />
    </div>
  );
}
