"use client";
import { PlusIcon, FolderIcon } from "lucide-react";
import UpsertDocumentForm from "../_forms/upsert-files";
import useModalStore from "../../../lib/global-state/modal-state";
import { Button } from "@repo/ui/components/ui/button";

interface FolderHeaderProps {
  folderName: string;
  fileCount: number;
  folderId?: string;
}

export default function FolderHeader({
  folderName,
  fileCount,
  folderId,
}: FolderHeaderProps) {
  const openModal = useModalStore((state) => state.openModal);

  const handleAddFile = () => {
    openModal(
      "Add File",
      "Use the form below to add a new file to this folder.",
      <UpsertDocumentForm folderId={folderId} />,
    );
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 p-2">
      <div className="flex w-full flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <FolderIcon className="h-5 w-5 text-primary" />
            <p className="text-lg text-foreground">{folderName}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            This folder contains {fileCount} files. Use the button on the right
            to add new files to this folder.
          </p>
        </div>
        <Button variant="outline" onClick={handleAddFile}>
          <PlusIcon className="h-4 w-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
}
