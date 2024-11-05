"use client";
import SpaceUpsertForm from "./_forms/upsert-space";
import { useQuery } from "convex/react";
import SpacesTable, { SpacesTableEntry } from "./_table/spaces-table";
import { api } from "@repo/backend/convex/_generated/api";
import { CustomPieChart, PieChartData } from "../_components/charts/custom-pie-chart";
import { RadialChart, RadialChartDataItem } from "../_components/charts/custom-radial-chart";
import { spaceRoleOptions } from "../../lib/app-data/static-data";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function SpacesTable
 * @description Renders a table of spaces or loading skeletons.
 * @param {Object} props - The component props.
 * @param {SpaceFormValues[]} props.spaces - Array of space data.
 * @param {boolean} props.isLoading - Indicates if spaces are still loading.
 * @returns {JSX.Element} The rendered SpacesTable component.
 */
function SpacesContentLoader({
  spaces,
  isLoading,
}: {
  spaces?: SpacesTableEntry[];
  isLoading: boolean;
}) {
  const spaceTypeData = useQuery(
    api.spaces.getTotalSpacesByType,
  ) as PieChartData[];

  const occupancyData = useQuery(
    api.spaces.getOccupancy,
  ) as RadialChartDataItem[];

  const roleFrequencies = useQuery(
    api.spaces.getRoleFrequencies,
  ) as PieChartData[];



  const formattedRoleFrequencies = roleFrequencies?.map((role) => ({
    ...role,
    label:
      spaceRoleOptions.find((option) => option.id === role.label)?.name ??
      role.label,
  }));

  console.log(roleFrequencies);

  console.log(spaceTypeData);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-background p-2">
        <TableSkeleton />
      </div>
    );
  }

  // No data found state
  if (!spaces || spaces.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your spaces?"
          title="No Spaces"
          description="No spaces have been added yet. Add a new space to get started."
          buttonText="Add Space"
          formComponent={<SpaceUpsertForm />}
          sheetTitle="Add New Space"
          sheetDescription="Enter details to create a new space"
        />
      </div>
    );
  }
  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      {/* Render the data table with the space information  */}
      {/* <SpacesContent spaces={spaces} /> */}
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
          title={"Occupancy Overview"}
          description="An overview of occupancy rates across all spaces"
        />
      </div>
      <SpacesTable data={spaces} />
    </div>
  );
}

/**
 * @function SpacesPage
 * @description The main component for the Spaces page.
 * It manages the state for spaces and renders the page layout.
 * @returns {JSX.Element} The rendered SpacesPage component.
 */
export default function SpacesPage() {
  // Get data for spaces
  // let spaces: any[] = [];
  // const spaces = getSpacesTableData();
  const spaces = useQuery(api.spaces.getAllSpaces);

  console.log(spaces);
  // const spaces = undefined;

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Spaces"
        description="Manage and view all spaces in your property. You can add new spaces, update existing ones, and assign them to specific buildings or floors for effective space management."
        buttonText="Add Space"
        sheetTitle="Add New Space"
        sheetDescription="Enter details to create a new space"
        sheetContent={"SpaceUpsertForm"}
        icon={"Spaces"}
      />
      <SpacesContentLoader spaces={spaces} isLoading={spaces === undefined} />
    </div>
  );
}
