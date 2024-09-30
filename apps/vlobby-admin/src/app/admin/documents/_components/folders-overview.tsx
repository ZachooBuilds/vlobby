"use client";


import { FolderIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


import UpsertFolderForm from "../_forms/upsert-folder";
import { FolderSummaryData } from "../../../lib/app-data/app-types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import NoData from "../../_components/global-components/no-data";



type Props = {
  folders: FolderSummaryData[];
};

export default function FolderOverview({ folders }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFolderClick = (folderId: string) => {
    router.push(`/admin/documents/${folderId}`);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between gap-2">
          <h2 className="text-lg font-medium">Folders ({folders.length})</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Folder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your documents.
                </DialogDescription>
              </DialogHeader>
              <UpsertFolderForm />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search folders..."
            className="w-56 pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {filteredFolders.length === 0 ? (
        <NoData
          badgeText="No Folders"
          title="No folders found"
          description="There are no folders matching your search criteria. Try adjusting your search or create a new folder if you havent allready."
        />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredFolders.map((folder, index) => (
            <div
              key={index}
              onClick={() => handleFolderClick(folder._id)}
              className="cursor-pointer rounded-lg border p-4 hover:border-primary"
            >
              <FolderIcon className="mb-2 h-10 w-10 text-primary" />
              <h3 className="text-sm font-medium">{folder.name}</h3>
              <p className="text-xs text-muted-foreground">
                {folder.fileCount} Files
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
