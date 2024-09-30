"use client";
import React from "react";

import FilesOverview from "../_components/files-overview";
import FolderHeader from "../_components/folder-header";
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { FileSummaryData, FolderSummaryData } from "../../../lib/app-data/app-types";
type FolderDetailsPageProps = {
  params: { id: string };
};

export default function FolderDetailsPage({ params }: FolderDetailsPageProps) {
  const folder = useQuery(api.documents.getFolder, {
    id: params.id as Id<"folders">,
  }) as FolderSummaryData;
  const files = useQuery(api.documents.getDocumentsByFolderId, {
    folderId: params.id as Id<"folders">,
  }) as FileSummaryData[];

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2">
      <FolderHeader
        folderName={folder?.name}
        fileCount={Number(folder?.fileCount)}
        folderId={params.id}
      />
      <div className="flex h-full w-full flex-col items-start justify-start overflow-scroll rounded-lg bg-background p-4">
        <FilesOverview files={files} maxDisplay={40} />
      </div>
    </div>
  );
}
