"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { FileUpload } from "../../../_components/custom-form-fields/file-upload-dropzone";

export default function MobileBackgroundUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(
    api.theme.generateMobileBackgroundUploadUrl,
  );
  const uploadMobileBackground = useMutation(api.theme.uploadMobileBackground);
  const deleteMobileBackground = useMutation(api.theme.deleteMobileBackground);

  type MobileBackground = {
    _id: Id<"_mobileAppBackgrounds">;
    orgId: string;
    storageId: string;
    url: string;
    // Add other properties if they exist in the iconImage object
  };

  const mobileBackgrounds =
    (useQuery(api.theme.getMobileBackgrounds) as MobileBackground[]) ?? [];

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    setIsUploading(true);

    const uploadUrl = await generateUploadUrl();

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">;
    };
    await uploadMobileBackground({ storageId: storageId });

    setIsModalOpen(false);
    setIsUploading(false);
  };

  const handleDelete = async (backgroundId: string) => {
    await deleteMobileBackground({
      backgroundId: backgroundId as Id<"mobileAppBackgrounds">,
    });
  };

  // const mobileBackgroundLoader = (url: string) => {
  //   return iconImage.url;
  // };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <p className="text-sm text-foreground">Mobile Backgrounds</p>
      <div className="grid w-full grid-cols-3 gap-4">
        {mobileBackgrounds.map((background) => (
          <div key={background._id} className="group relative">
            <Image
              src={background.url}
              alt="Mobile background"
              className="h-[600px] w-full rounded-sm object-contain"
              width={300}
              height={160}
              unoptimized
            />
            <button
              onClick={() => handleDelete(background._id)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <div className="flex h-full min-h-[600px] cursor-pointer items-center justify-center rounded-sm border border-dashed border-muted transition-colors hover:border-primary">
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:min-w-[400px]">
            {isUploading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Uploading...</span>
              </div>
            ) : (
              <FileUpload key="mobile" onChange={handleFileUpload} files={[]} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
