"use client";
import SpaceTypesTable, { SpaceType } from "./_tables/space-types-table";
import { useQuery } from "convex/react";
import TicketTypesTable, { TicketType } from "./_tables/ticket-types-table";
import OfferCategoriesTable, {
  OfferCategory,
} from "./_tables/offer-categories-table";
import ServiceLocationsTable, {
  ServiceLocation,
} from "./_tables/service-location-table";
import BuildingSummary from "./_components/building-summary";
import FacilityTypesTable from "./_tables/facility-types-table";
import { FacilityTypeData } from "./_forms/upsert-facility-types";
import KeyTypesTable, { KeyTypeDetails } from "./_tables/key-types";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../../_components/global-components/section-header";
import { BuildingFormValues } from "./_forms/upsert-building";

export default function SettingsPage() {
  // Fetch all space types using Convex query
  const spaceTypes = useQuery(api.spaces.getAllSpaceTypes);
  const ticketTypes = useQuery(api.tickets.getAllTicketTypes);
  const offerCategories = useQuery(api.offers.getAllOfferCategories);
  const serviceLocations = useQuery(api.tickets.getAllTicketLocations);
  const facilityTypes = useQuery(api.facilities.getAllFacilityTypes);
  const buildings = useQuery(api.site.getAllSites);
  const keyTypes = useQuery(api.keys.getAllKeyTypes);
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-md bg-background p-4">
      {/* Buildings Overview */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with space type management options */}
        <SectionHeader
          title="Buildings"
          description="Manage and customize the buildings within your project or site, such as Eastern Tower, Western Wing, or Main Complex"
          icon="Building"
          buttonText="Add Building"
          sheetTitle="Create New Building"
          sheetDescription="Define a new building for your project or site"
          isModal={true}
          sheetContent="BuildingUpsertForm"
        />
        {/* Render the grid containing all buildings */}
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          {buildings?.map((building: BuildingFormValues) => (
            <BuildingSummary key={building._id} buildingDetails={building} />
          ))}
        </div>
      </div>

      {/* Space Types */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with space type management options */}
        <SectionHeader
          title="Space Types"
          description="Manage and customize the types of spaces in your property, such as apartments, offices, or suites"
          icon="Spaces"
          buttonText="Add Space Type"
          sheetTitle="Create New Space Type"
          sheetDescription="Define a new type of space for your property"
          isModal={true}
          sheetContent="SpaceTypeUpsertForm"
        />
        {/* Render the table containing all space types */}
        <div className="flex w-full rounded-sm">
          <SpaceTypesTable data={spaceTypes as SpaceType[]} />
        </div>
      </div>

      {/* Ticket Types */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with space type management options */}
        <SectionHeader
          title="Ticket Types"
          description="Manage and customize the types of tickets in your system, such as maintenance requests, complaints, or inquiries"
          icon="Ticket"
          buttonText="Add Ticket Type"
          sheetTitle="Create New Ticket Type"
          sheetDescription="Define a new type of ticket for your system"
          isModal={true}
          sheetContent="TicketTypeUpsertForm"
        />
        {/* Render the table containing all space types */}
        <div className="flex w-full rounded-sm">
          <TicketTypesTable data={ticketTypes as TicketType[]} />
        </div>
      </div>

      {/* Offer Categories */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with space type management options */}
        <SectionHeader
          title="Offer Categories"
          description="Manage and customize categories for offers in your hotel, such as food and drink, activities, or stay packages"
          icon="Offers"
          buttonText="Add Offer Category"
          sheetTitle="Create New Offer Category"
          sheetDescription="Define a new category for offers in your hotel"
          isModal={true}
          sheetContent="OfferCategoryUpsertForm"
        />
        {/* Render the table containing all space types */}
        <div className="flex w-full rounded-sm">
          <OfferCategoriesTable data={offerCategories as OfferCategory[]} />
        </div>
      </div>

      {/* Service Locations */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with space type management options */}
        <SectionHeader
          title="Service Locations"
          description="Manage and customize service locations in your site, such as bathrooms, kitchens, hallways, and common areas like the pool"
          icon="Building"
          buttonText="Add Service Location"
          sheetTitle="Create New Service Location"
          sheetDescription="Define a new service location in your hotel"
          isModal={true}
          sheetContent="ServiceLocationUpsertForm"
        />
        {/* Render the table containing all space types */}
        <div className="flex w-full rounded-sm">
          <ServiceLocationsTable data={serviceLocations as ServiceLocation[]} />
        </div>
      </div>

      {/* Facility Types */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with space type management options */}
        <SectionHeader
          title="Facility Types"
          description="Manage and customize facility types in your site, such as gyms, restaurants, spas, and other amenities"
          icon="Facility"
          buttonText="Add Facility Type"
          sheetTitle="Create New Facility Type"
          sheetDescription="Define a new facility type for your hotel"
          isModal={true}
          sheetContent="FacilityTypeUpsert"
        />
        {/* Render the table containing all space types */}
        <div className="flex w-full rounded-sm">
          <FacilityTypesTable data={facilityTypes as FacilityTypeData[]} />
        </div>
      </div>

      {/* Key Types */}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {/* Render the section header with key type management options */}
        <SectionHeader
          title="Key Types"
          description="Manage and customize key types in your site, such as master keys, guest keys, and staff keys"
          icon="Key"
          buttonText="Add Key Type"
          sheetTitle="Create New Key Type"
          sheetDescription="Define a new key type for your hotel"
          isModal={true}
          sheetContent="KeyTypeUpsertForm"
        />
        {/* Render the table containing all key types */}
        <div className="flex w-full rounded-sm">
          <KeyTypesTable data={keyTypes as KeyTypeDetails[]} />
        </div>
      </div>
    </div>
  );
}
