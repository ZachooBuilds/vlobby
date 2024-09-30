"use client";

import { FileIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { FileSummaryData } from "../../../lib/app-data/app-types";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Input } from "@repo/ui/components/ui/input";
import NoData from "../../_components/global-components/no-data";

type Props = {
  files: FileSummaryData[];
  maxDisplay?: number;
};

export default function FilesOverview({ files, maxDisplay = 8 }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const incrementDocumentViews = useMutation(
    api.documents.incrementDocumentViews,
  );

  const handleViewIncrement = async (id: string) => {
    await incrementDocumentViews({ id: id as Id<"documents"> });
  };

  if (!files) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayFiles = filteredFiles.slice(0, maxDisplay);

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium">Files ({files.length})</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            className="w-56 pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {displayFiles.length === 0 ? (
        <NoData
          badgeText="No Files"
          title="No files found"
          description="There are no files matching your search criteria. Try adjusting your search or upload a new file if you haven't already."
        />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {displayFiles.map((file, index) => (
            <Link
              key={index}
              href={file.fileUrl}
              target="_blank"
              onClick={() => handleViewIncrement(file._id)}
            >
              <div className="h-full rounded-lg border border-muted p-4 hover:border-primary">
                <FileIcon className="mb-2 h-10 w-10 text-primary" />
                <h3 className="text-sm font-medium">{file.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {file.views} Views
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
