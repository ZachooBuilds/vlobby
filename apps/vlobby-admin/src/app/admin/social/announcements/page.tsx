"use client";
/**
 * @file AnnouncementsPage Component
 * @description This component provides the main page for managing announcements.
 * It includes a section header, a table to display announcements, and handles
 * loading and no-data states.
 */

import { useQuery } from "convex/react";
import AnnouncementsTable from "./_table/announcements-table";
import SocialNavigation from "../_components/social-navigation";
import AnnouncementUpsertForm from "./_forms/announcement-form";
import { AnnouncementTableEntry } from "../../../lib/app-data/app-types";
import { TableSkeleton } from "../../_components/skeletons/table-loading-skeleton";
import NoData from "../../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../../_components/global-components/section-header";

/**
 * @function AnnouncementsContentLoader
 * @description Handles the display of announcements data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {AnnouncementTableEntry[]} [props.announcements] - Array of announcement data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function AnnouncementsContentLoader({
  announcements,
  isLoading,
}: {
  announcements?: AnnouncementTableEntry[];
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
  if (!announcements || announcements.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your announcements?"
          title="No Announcements"
          description="No announcements have been added yet. Add a new announcement to get started."
          buttonText="Add Announcement"
          formComponent={<AnnouncementUpsertForm />}
          sheetTitle="Add New Announcement"
          sheetDescription="Enter details to add a new announcement"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <AnnouncementsTable data={announcements} />
    </div>
  );
}

/**
 * @function AnnouncementsPage
 * @description The main component for the Announcements page
 * @returns {JSX.Element} The rendered AnnouncementsPage component
 */
export default function AnnouncementsPage() {
  // Fetch announcements data using Convex query
  const announcements = useQuery(
    api.announcements.getAllAnnouncements,
  ) as AnnouncementTableEntry[];

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Announcements"
        description="Manage and view all announcements for your property. You can add new announcements, update existing ones, and track their status."
        buttonText="Add Announcement"
        sheetTitle="Add New Announcement"
        sheetDescription="Enter details to add a new announcement"
        sheetContent="AnnouncementUpsertForm"
        icon="Announcement"
      />
      <SocialNavigation />
      <AnnouncementsContentLoader
        announcements={announcements}
        isLoading={announcements === undefined}
      />
    </div>
  );
}
