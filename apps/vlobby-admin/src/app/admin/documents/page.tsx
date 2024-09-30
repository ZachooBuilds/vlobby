"use client";
/**
 * @file DocumentsPage Component
 * @description This component provides the main page for managing documents.
 * It includes a section header, a table to display documents, and handles
 * loading and no-data states.
 */
import { useQuery } from "convex/react";
import FolderOverview from "./_components/folders-overview";
import FilesOverview from "./_components/files-overview";
import { FileSummaryData, FolderSummaryData } from "../../lib/app-data/app-types";
import useModalStore from "../../lib/global-state/modal-state";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function DocumentsContentLoader
 * @description Handles the display of documents data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {DocumentFormData[]} [props.documents] - Array of document data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function DocumentsContentLoader({
  files,
  folders,
  isLoading,
}: {
  files?: FileSummaryData[];
  folders?: FolderSummaryData[];
  isLoading: boolean;
}) {
  const openModal = useModalStore((state) => state.openModal);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-background p-2">
        <TableSkeleton />
      </div>
    );
  }

  // Data found state
  return (
    <div className="flex  w-full flex-col items-start justify-start gap-2 rounded-lg bg-background p-4">
      <FolderOverview folders={folders ?? []} />
      <FilesOverview files={files ?? []} maxDisplay={8} />
    </div>
  );
}

/**
 * @function DocumentsPage
 * @description The main component for the Documents page
 * @returns {JSX.Element} The rendered DocumentsPage component
 */
export default function DocumentsPage() {
  const folders = useQuery(
    api.documents.getAllFolderOverviews,
  ) as FolderSummaryData[];

  const files = useQuery(api.documents.getAllDocuments) as FileSummaryData[];

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Documents"
        description="Manage and view all documents for your site. You can add new documents, update existing ones, and track their status."
        buttonText="Upload Document"
        sheetTitle="Upload New Document"
        sheetDescription="Enter details to upload a new document"
        sheetContent={"FileUpsertForm"}
        icon={"Documents"}
        isModal={true}
      />
      <DocumentsContentLoader
        files={files}
        folders={folders}
        isLoading={false}
      />
    </div>
  );
}
