"use client";
/**
 * @file ContractorsPage Component
 * @description This component provides the main page for managing contractors.
 * It includes a section header, a table to display contractors, and handles
 * loading and no-data states.
 */
import ContractorsTable from "./_table/contractors-table";
import ContractorUpsertForm from "./_forms/contractor-upsert-form";
import { useQuery } from "convex/react";
import { ContractorFormData } from "./_forms/contractor-validation";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function ContractorsContentLoader
 * @description Handles the display of contractors data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {ContractorFormData[]} [props.contractors] - Array of contractor data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function ContractorsContentLoader({
  contractors,
  isLoading,
}: {
  contractors?: ContractorFormData[];
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
  if (!contractors || contractors.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your contractors?"
          title="No Contractors"
          description="No contractors have been added yet. Add a new contractor to get started."
          buttonText="Add Contractor"
          formComponent={<ContractorUpsertForm />}
          sheetTitle="Add New Contractor"
          sheetDescription="Enter details to add a new contractor"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <ContractorsTable data={contractors} />
    </div>
  );
}

/**
 * @function ContractorsPage
 * @description The main component for the Contractors page
 * @returns {JSX.Element} The rendered ContractorsPage component
 */
export default function ContractorsPage() {
  // Fetch contractors data using Convex query
  const contractors = useQuery(api.contractors.getAll) as ContractorFormData[];

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Contractors"
        description="Manage and view all contractors for your property. You can add new contractors, update existing ones, and assign them to specific projects or maintenance tasks."
        buttonText="Add Contractor"
        sheetTitle="Add New Contractor"
        sheetDescription="Enter details to add a new contractor"
        sheetContent={"ContractorUpsertForm"}
        icon={"Contractor"}
      />
      <ContractorsContentLoader
        contractors={contractors}
        isLoading={contractors === undefined}
      />
    </div>
  );
}
