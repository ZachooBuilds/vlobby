"use client";
/**
 * @file ParcelsPage Component
 * @description This component provides the main page for managing parcels.
 * It includes a section header, a table to display parcels, and handles
 * loading and no-data states.
 */
import { useQuery } from "convex/react";
import ParcelUpsertForm from "./_forms/parcel-upsert-form";
import ParcelsTable from "./_table/parcels-table";
import { ParcelTableData } from "../../lib/app-data/app-types";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function ParcelsContentLoader
 * @description Handles the display of parcels data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {ParcelFormData[]} [props.parcels] - Array of parcel data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function ParcelsContentLoader({
  parcels,
  isLoading,
}: {
  parcels?: ParcelTableData[];
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
  if (!parcels || parcels.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your parcels?"
          title="No Parcels"
          description="No parcels have been added yet. Add a new parcel to get started."
          buttonText="Add Parcel"
          formComponent={<ParcelUpsertForm />}
          sheetTitle="Add New Parcel"
          sheetDescription="Enter details to add a new parcel"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <ParcelsTable data={parcels} />
    </div>
  );
}

/**
 * @function ParcelsPage
 * @description The main component for the Parcels page
 * @returns {JSX.Element} The rendered ParcelsPage component
 */
export default function ParcelsPage() {
  // Fetch parcels data using Convex query
  const parcels = useQuery(
    api.parcels.getAllParcelsFormatted,
  ) as ParcelTableData[];

  console.log("parcels", parcels);

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Parcels"
        description="Manage and view all parcels for your property. You can add new parcels, update existing ones, and track their status."
        buttonText="Add Parcel"
        sheetTitle="Add New Parcel"
        sheetDescription="Enter details to add a new parcel"
        sheetContent={"ParcelUpsertForm"}
        icon={"Parcel"}
      />
      <ParcelsContentLoader
        parcels={parcels}
        isLoading={parcels === undefined}
      />
    </div>
  );
}
