"use client";

import { useQuery } from "convex/react";
import { FacilityFormData } from "./_forms/facility-validation";
import FacilityUpsertForm from "./_forms/facility-upsert-form";
import FacilityCard from "./_components/facility-card";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import SectionHeader from "../_components/global-components/section-header";
import { api } from "@repo/backend/convex/_generated/api";

/**
 * @function SpacesTable
 * @description Renders a table of spaces or loading skeletons.
 * @param {Object} props - The component props.
 * @param {SpaceFormValues[]} props.spaces - Array of space data.
 * @param {boolean} props.isLoading - Indicates if spaces are still loading.
 * @returns {JSX.Element} The rendered SpacesTable component.
 */
function FacilitiesContentLoader({
  facilities,
  isLoading,
}: {
  facilities?: FacilityFormData[];
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
  if (!facilities || facilities.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your facilities?"
          title="No Facilities"
          description="No facilities have been added yet. Add a new facility to get started."
          buttonText="Add Facility"
          formComponent={<FacilityUpsertForm />}
          sheetTitle="Add New Facility"
          sheetDescription="Enter details to create a new facility"
        />
      </div>
    );
  }
  // Data found state
  return (
    <div className=" grid w-full grid-cols-1 items-start justify-start gap-2 rounded-lg bg-background p-2 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility) => (
        <FacilityCard facility={facility} key={facility._id} />
      ))}
    </div>
  );
}

/**
 * @function SpacesPage
 * @description The main component for the Spaces page.
 * It manages the state for spaces and renders the page layout.
 * @returns {JSX.Element} The rendered SpacesPage component.
 */
export default function FacilitiesPage() {
  // Get data for facilities

  const facilities = useQuery(api.facilities.getAllFacilities);

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Facilities"
        description="Manage and view all facilities in your property. You can add new facilities, update existing ones, and assign them to specific buildings or floors for effective facility management."
        buttonText="Add Facility"
        sheetTitle="Add New Facility"
        sheetDescription="Enter details to create a new facility"
        sheetContent={"FacilityUpsertForm"}
        icon={"Facility"}
      />
      <FacilitiesContentLoader
        facilities={facilities as FacilityFormData[]}
        isLoading={facilities === undefined}
      />
    </div>
  );
}
