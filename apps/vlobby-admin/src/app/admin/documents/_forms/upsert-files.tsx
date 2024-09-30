"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { FileFormValues, fileSchema } from "./documents-validation";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";
import { Button } from "@repo/ui/components/ui/button";

const UpsertFileForm = ({ folderId }: { folderId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get Data for Folders
  const getFolders = useQuery(
    api.documents.getAllFoldersValueLabelPairs,
  ) as ValueLabelPair[];

  // Mutation for inserting documents
  const insertDocuments = useMutation(api.documents.insertDocuments);

  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      folderId: folderId,
    },
  });

  const onSubmit = async (data: FileFormValues) => {
    setIsLoading(true);
    try {
      const documents = data.files.map((file) => ({
        name: file.name || "",
        type: file.type || "",
        storageId: file.storageId,
      }));

      await insertDocuments({
        documents,
        folderId: data.folderId as Id<"folders">,
      });

      toast({
        title: "Documents Uploaded",
        description: "Your documents have been successfully uploaded.",
      });
      form.reset();
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Folder Field */}
        <FormField
          control={form.control}
          name="folderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getFolders?.map((folder) => (
                    <SelectItem key={folder.value} value={folder.value}>
                      {folder.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a folder where this document will be stored
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <div className="flex w-full">
          <FileUploadWithPreview
            name="files"
            label="File(s)"
            multiple={true}
            maxFiles={10}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Upload Document
        </Button>
      </form>
    </Form>
  );
};

export default UpsertFileForm;
