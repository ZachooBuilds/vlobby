"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@repo/ui/hooks/use-toast";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Switch } from "@repo/ui/components/ui/switch";
import { Button } from "@repo/ui/components/ui/button";
import { FileUploadWithPreview } from "../../../_components/file-upload-form-field";


export const globalNoteFormSchema = z.object({
  _id: z.string().optional(),
  _creationTime: z.string(),
  content: z.string().min(1, "Note content is required"),
  isPrivate: z.boolean(),
  files: z
    .array(
      z.object({
        url: z.string().url(),
        storageId: z.string(),
      }),
    )
    .optional(),
  noteType: z.string().min(1, "Note type is required"),
  author: z.string().min(1, "Author is required"),
});

export type GlobalNoteData = z.infer<typeof globalNoteFormSchema>;

type Props = {
  selectedNote?: GlobalNoteData;
  entityId: string;
  noteType:
    | "issue"
    | "workOrder"
    | "ticket"
    | "vehicle"
    | "occupant"
    | "space"
    | "contractor";
};

const GlobalNoteForm = ({ selectedNote, noteType, entityId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const upsertGlobalNote = useMutation(api.notes.upsertGlobalNote);

  const form = useForm<GlobalNoteData>({
    defaultValues: selectedNote ?? {
      content: "",
      isPrivate: false,
      files: [],
      noteType: noteType,
      author: "system",
    },
  });

  const onSubmit = async (data: GlobalNoteData) => {
    setIsLoading(true);
    try {
      await upsertGlobalNote({
        _id: data._id as Id<"globalNotes">,
        content: data.content,
        isPrivate: data.isPrivate,
        files: data.files?.map((file) => file.storageId) as Id<"_storage">[],
        noteType: data.noteType,
        entityId: entityId,
      });
      toast({
        title: "Success",
        description: "Note has been saved successfully.",
      });
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error upserting note:", error);
      toast({
        title: "Error",
        description: "Failed to save the note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your note here..."
                    className="min-h-[150px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Private Note</FormLabel>
                  <FormDescription>
                    Toggle to make this note private
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Offer Image Upload */}
          <div className="flex w-full">
            <FileUploadWithPreview
              name="files"
              label="Attachments (Max 5)"
              multiple={true}
              maxFiles={5}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Add Note
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default GlobalNoteForm;
