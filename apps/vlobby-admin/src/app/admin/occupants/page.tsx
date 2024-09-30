"use client";
import OccupantUpsertForm from "./_form/occupant-upsert";
import { useQuery } from "convex/react";
import OccupantsTable, { OccupantsTableEntry } from "./_table/occupants-table";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function OccupantsContentLoader
 * @description Renders a table of occupants or loading skeletons.
 * @param {Object} props - The component props.
 * @param {OccupantsTableEntry[]} props.occupants - Array of occupant data.
 * @param {boolean} props.isLoading - Indicates if occupants are still loading.
 * @returns {JSX.Element} The rendered OccupantsContentLoader component.
 */
function OccupantsContentLoader({
  occupants,
  isLoading,
}: {
  occupants?: OccupantsTableEntry[];
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
  if (!occupants || occupants.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your occupants?"
          title="No Occupants"
          description="No occupants have been added yet. Add a new occupant to get started."
          buttonText="Add Occupant"
          formComponent={<OccupantUpsertForm />}
          sheetTitle="Add New Occupant"
          sheetDescription="Enter details to create a new occupant"
        />
      </div>
    );
  }
  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <OccupantsTable data={occupants} />
    </div>
  );
}

/**
 * @function OccupantsPage
 * @description The main component for the Occupants page.
 * It manages the state for occupants and renders the page layout.
 * @returns {JSX.Element} The rendered OccupantsPage component.
 */
export default function OccupantsPage() {
  const occupants = useQuery(api.occupants.getUsersWithSpaces);

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Occupants"
        description="Manage and view all occupants in your property. You can add new occupants, update their information, and assign them to specific spaces or roles for efficient property management."
        buttonText="Add Occupant"
        sheetTitle="Add New Occupant"
        sheetDescription="Enter details to create a new occupant"
        sheetContent={"OccupantUpsertForm"}
        icon={"Occupants"}
      />
      <OccupantsContentLoader occupants={occupants} isLoading={occupants === undefined} />
    </div>
  );
}
