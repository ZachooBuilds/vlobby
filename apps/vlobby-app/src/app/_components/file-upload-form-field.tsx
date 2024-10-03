'use client';

/**
 * FileUploadWithPreview Component
 *
 * This component provides a file upload field with preview functionality for use in forms.
 *
 * Usage:
 * 1. Import the component:
 *    import { FileUploadWithPreview } from "@/components/custom-form-fields/file-upload-form-field";
 *
 * 2. Use it in your form:
 *    <FileUploadWithPreview
 *      name="files"
 *      label="Upload Files"
 *      multiple={true}
 *      maxFiles={5}
 *    />
 *
 * 3. In your form schema, define the field like this:
 *    files: z.array(
 *      z.object({
 *        url: z.string().url(),
 *        storageId: z.string(),
 *        name: z.string().optional(),
 *      })
 *    ).min(1, "At least one file is required"),
 *
 * Note: This component requires being wrapped in a react-hook-form context.
 */

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { FileIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Button } from '@repo/ui/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { FileUploadForm } from './file-upload-dropzone-form';
import { FileData, FileUploadWithPreviewProps } from '../../lib/app-types';

/**
 * @function FileUploadWithPreview
 * @description A reusable component for file uploads in forms
 * @param {FileUploadWithPreviewProps} props - The props for the component
 */
export function FileUploadWithPreview({
  name,
  label = 'Files',
  multiple = false,
  maxFiles = 5,
}: FileUploadWithPreviewProps) {
  // Use the context of the form this component is added to.
  const form = useFormContext();

  // State to store the files currently being uploadded
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  // Convex mutations for file upload (generate short lived upload URL and save file to database and generate storage ID)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveFile = useMutation(api.storage.saveFile);

  /**
   * @function handleFileUpload
   * @description Handles the file upload process
   * @param {File[]} files - The files to be uploaded
   */
  const handleFileUpload = async (files: File[]) => {
    // Create new array to store the files that are currently being uploaded
    const newFiles: FileData[] = [];
    setUploadingFiles(files.map((file) => file.name));

    for (const file of files) {
      // Generate upload URL and save file
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const { storageId } = (await result.json()) as {
        storageId: Id<'_storage'>;
      };
      const savedFile = await saveFile({ storageId });
      if (savedFile.url) {
        newFiles.push({
          url: savedFile.url,
          storageId: savedFile.storageId,
          name: file.name,
          type: file.type, // Add this line
        });
      }
      setUploadingFiles((prev) => prev.filter((name) => name !== file.name));
    }

    // Update form value with new files
    const currentValue = form.getValues(name) as FileData[] | undefined;
    form.setValue(name, [...(currentValue ?? []), ...newFiles]);
  };

  /**
   * @function renderFilePreview
   * @description Renders a preview of an uploaded file
   * @param {FileData} file - The file data to render
   * @param {number} index - The index of the file in the list
   */
  const renderFilePreview = (file: FileData, index: number) => {
    const isPDF = file.name?.toLowerCase().endsWith('.pdf');

    return (
      <div key={index} className="group relative">
        <div className="h-[300px] w-full rounded-lg">
          {isPDF ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
              <FileIcon className="h-25 w-25 text-gray-400" />
              <span className="mt-2 max-w-full truncate px-2 text-sm text-gray-600">
                {file.name}
              </span>
            </div>
          ) : (
            <Image
              src={file.url}
              alt={`File ${index + 1}`}
              className="h-full w-full rounded-sm object-cover object-top"
              width={300}
              height={300}
              unoptimized
            />
          )}
        </div>
        <Button
          onClick={() => {
            // Remove file from form value
            const currentFiles = form.getValues(name) as FileData[];
            const updatedFiles = currentFiles.filter((_, i) => i !== index);
            form.setValue(name, updatedFiles);
          }}
          variant="destructive"
          size="icon"
          type="button"
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  /**
   * @function renderUploadingIndicator
   * @description Renders an indicator for files currently being uploaded
   * @param {string} fileName - The name of the file being uploaded
   */
  const renderUploadingIndicator = (fileName: string) => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-lg border-2 border-dashed border-muted bg-background">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-foreground">Uploading {fileName}...</span>
      </div>
    </div>
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="w-full">
              <div
                className={`grid w-full gap-4 ${
                  multiple ? 'grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {/* Render previews for uploaded files */}
                {(field.value as FileData[])?.map((file, index) =>
                  renderFilePreview(file, index)
                )}
                {/* Render indicators for files being uploaded */}
                {uploadingFiles.map((fileName) =>
                  renderUploadingIndicator(fileName)
                )}

                {/* Render file upload form if below max files limit */}
                {((field.value as FileData[] | undefined)?.length ?? 0) +
                  uploadingFiles.length <
                  maxFiles && (
                  <div className="w-full">
                    <FileUploadForm
                      onChange={handleFileUpload}
                      files={(field.value as File[]) ?? []}
                    />
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
