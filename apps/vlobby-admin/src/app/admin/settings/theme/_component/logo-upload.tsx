"use client";
import { useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { FileUpload } from "../../../_components/custom-form-fields/file-upload-dropzone";

export default function LogoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.theme.generateLogoUploadUrl);
  const uploadLogoImage = useMutation(api.theme.uploadLogoImage);
  // Add this near the top of your file, with other type definitions
  type LogoImage = {
    url: string;
    storageId: Id<"_storage">;
    // Add other properties if they exist in the LogoImage object
  };
  const logoImage = useQuery(api.theme.getLogoImage) as LogoImage;
  const deleteLogoImage = useMutation(api.theme.uploadLogoImage);

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    setIsUploading(true);
    console.log(file);
    // Step 1: Get a short-lived upload URL
    const logoUploadUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(logoUploadUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">;
    };

    // Step 3: Save the newly allocated storage id to the database
    await uploadLogoImage({
      storageId: storageId,
      oldStorageId: logoImage?.storageId,
    });

    setSelectedFile(null);
    setIsModalOpen(false);
    console.log(files);
    setIsUploading(false);
  };

  console.log(logoImage);

  const logoLoader = () => {
    return logoImage.url;
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <p className="text-sm text-foreground">Logo</p>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="group mx-auto min-h-72 w-full max-w-4xl cursor-pointer rounded-lg border border-dashed border-muted bg-background">
            {logoImage ? (
              <div className="flex h-full flex-col items-center justify-center gap-5">
                <Image
                  src={logoImage.url}
                  alt="Icon preview"
                  className="h-[100px] w-full rounded-sm object-contain"
                  width={200}
                  height={200}
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-5">
                <UploadCloud className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                <p className="text-muted-foreground">
                  Click to upload logo image
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
              key="logo"
              onChange={handleFileUpload}
              files={selectedFile ? [selectedFile] : []}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
