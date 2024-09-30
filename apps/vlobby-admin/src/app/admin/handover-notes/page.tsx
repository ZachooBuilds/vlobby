"use client";
/**
 * @file HandoverNotesPage Component
 * @description This component provides the main page for managing handover notes.
 * It includes a section header, a table to display handover notes, and handles
 * loading and no-data states.
 */

import { useQuery } from "convex/react";
import HandoverNoteUpsertForm from "./_forms/handover-note-upsert-form";
import HandoverNotesTable from "./_table/handover-notes-table";
import { HandoverNoteTableEntry } from "./_table/handover-notes-table";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function HandoverNotesContentLoader
 * @description Handles the display of handover notes data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {HandoverNoteTableEntry[]} [props.handoverNotes] - Array of handover note data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function HandoverNotesContentLoader({
  handoverNotes,
  isLoading,
}: {
  handoverNotes?: HandoverNoteTableEntry[];
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
  if (!handoverNotes || handoverNotes.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your handover notes?"
          title="No Handover Notes"
          description="No handover notes have been added yet. Add a new handover note to get started."
          buttonText="Add Handover Note"
          formComponent={<HandoverNoteUpsertForm />}
          sheetTitle="Add New Handover Note"
          sheetDescription="Enter details to add a new handover note"
        />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <HandoverNotesTable data={handoverNotes} />
    </div>
  );
}

/**
 * @function HandoverNotesPage
 * @description The main component for the Handover Notes page
 * @returns {JSX.Element} The rendered HandoverNotesPage component
 */
export default function HandoverNotesPage() {
  // Fetch handover notes data using Convex query
  const handoverNotes = useQuery(
    api.handoverNotes.getAll,
  ) as HandoverNoteTableEntry[];



  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Handover Notes"
        description="Manage and view all handover notes for your property. You can add new notes, update existing ones, and track their status."
        buttonText="Add Handover Note"
        sheetTitle="Add New Handover Note"
        sheetDescription="Enter details to add a new handover note"
        sheetContent="HandoverNoteUpsertForm"
        icon="Handover"
      />
      <HandoverNotesContentLoader
        handoverNotes={handoverNotes}
        isLoading={handoverNotes === undefined}
      />
    </div>
  );
}
