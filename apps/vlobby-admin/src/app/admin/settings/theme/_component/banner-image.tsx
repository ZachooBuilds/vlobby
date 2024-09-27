"use client";
import { useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { FileUpload } from "../../../_components/custom-form-fields/file-upload-dropzone";

// Component for uploading and displaying a banner image
export default function BannerImageUpload() {
  // State for managing the selected file, modal visibility, and upload status
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Convex mutations and queries
  const generateUploadUrl = useMutation(api.theme.generateBannerUploadUrl);
  const uploadBannerImage = useMutation(api.theme.uploadBannerImage);

  // Type definition for the banner image object
  type BannerImage = {
    url: string;
    storageId: Id<"_storage">;
  };

  // Query to fetch the current banner image
  const bannerImage = useQuery(api.theme.getBannerImage) as BannerImage;

  // Mutation to delete the banner image (Note: This seems to be incorrectly set to uploadBannerImage)
  const deleteBannerImage = useMutation(api.theme.uploadBannerImage);

  // Function to handle file upload
  // Input: files (File[]) - Array of files to upload
  // Returns: Promise<void>
  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    setIsUploading(true);

    // Step 1: Get a short-lived upload URL
    const bannerUploadUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(bannerUploadUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    // Step 3: Extract the storage ID from the response
    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">;
    };

    // Step 4: Save the newly allocated storage id to the database
    await uploadBannerImage({
      storageId: storageId,
      oldStorageId: bannerImage?.storageId,
    });

    // Reset state and close modal
    setSelectedFile(null);
    setIsModalOpen(false);
    setIsUploading(false);
  };

  const bannerLoader = () => {
    return bannerImage.url;
  };

  // Render the component
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <p className="text-sm text-foreground">Banner</p>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="group mx-auto min-h-72 w-full max-w-4xl cursor-pointer rounded-lg border border-dashed border-muted bg-background">
            {bannerImage ? (
              // Display the current banner image if it exists
              <Image
                src={bannerImage.url}
                alt="Banner preview"
                className="h-[300px] w-full rounded-sm object-cover object-top"
                width={1600}
                height={800}
                unoptimized
              />
            ) : (
              // Display upload placeholder if no banner image exists
              <div className="flex h-full flex-col items-center justify-center gap-5">
                <UploadCloud className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                <p className="text-muted-foreground">
                  Click to upload banner image
                </p>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:min-w-[400px]">
          {isUploading ? (
            // Display loading spinner while uploading
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Uploading...</span>
            </div>
          ) : (
            // Display file upload component when not uploading
            <FileUpload
              key="banner"
              onChange={handleFileUpload}
              files={selectedFile ? [selectedFile] : []}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
