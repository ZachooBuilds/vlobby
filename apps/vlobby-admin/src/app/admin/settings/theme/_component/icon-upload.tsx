"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { FileUpload } from "../../../_components/custom-form-fields/file-upload-dropzone";

export default function IconUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.theme.generateIconUploadUrl);
  const uploadIconImage = useMutation(api.theme.uploadIconImage);
  // Add this near the top of your file, with other type definitions
  type IconImage = {
    url: string;
    storageId: Id<"_storage">;
    // Add other properties if they exist in the iconImage object
  };
  const iconImage = useQuery(api.theme.getIconImage) as IconImage;
  const deleteIconImage = useMutation(api.theme.uploadIconImage);

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    setIsUploading(true);
    // Step 1: Get a short-lived upload URL
    const iconUploadUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(iconUploadUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

   const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
    // Step 3: Save the newly allocated storage id to the database
    await uploadIconImage({
      storageId: storageId,
      oldStorageId: iconImage?.storageId,
    });

    setSelectedFile(null);
    setIsModalOpen(false);
    setIsUploading(false);
  };

   const iconLoader = () => {
     return iconImage.url;
   };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <p className="text-sm text-foreground">Icon</p>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="group mx-auto min-h-72 w-full max-w-4xl cursor-pointer rounded-lg border border-dashed border-muted bg-background">
            {iconImage ? (
              <div className="flex h-full flex-col items-center justify-center gap-5">
                <Image
                  src={iconImage.url}
                  alt="Icon preview"
                  className="h-[150px] w-full rounded-sm object-contain"
                  width={200}
                  height={200}
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-5">
                <UploadCloud className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                <p className="text-muted-foreground">
                  Click to upload icon image
                </p>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:min-w-[400px]">
          {isUploading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Uploading...</span>
            </div>
          ) : (
            <FileUpload
              key="icon"
              onChange={handleFileUpload}
              files={selectedFile ? [selectedFile] : []}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
