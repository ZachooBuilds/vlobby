"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Loader2, Plus, Trash } from "lucide-react";

import { FolderFormValues, folderSchema } from "./documents-validation";
import { useMutation } from "convex/react";
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Button } from '@repo/ui/components/ui/button';
import AudienceField from "../../_components/custom-form-fields/audience-form-field";
import { Input } from "@repo/ui/components/ui/input";


const UpsertFolderForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      audience: [{ type: "", entity: "" }],
    },
  });

  const {
    fields: audienceFields,
    append: appendAudience,
    remove: removeAudience,
  } = useFieldArray({
    control: form.control,
    name: "audience",
  });

  const upsertFolder = useMutation(api.documents.upsertFolder);

  const onSubmit = async (data: FolderFormValues) => {
    setIsLoading(true);
    try {
      const folderId = await upsertFolder({
        name: data.name,
        audience: data.audience ?? [],
      });
      toast({
        title: "Folder Created",
        description: `Folder "${data.name}" has been created successfully.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter folder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-start justify-start gap-2">
          <p className="text-sm font-medium">Audience</p>
          <p className="text-xs text-muted-foreground">
            Set the audience for this booking type here you can add multiple
            different audiences to control who will be able to book using this
            type
          </p>
        </div>
        {audienceFields.map((field, index) => (
          <div key={field.id} className="flex flex-row items-end gap-2">
            <AudienceField index={index} />
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeAudience(index)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          className="w-full border border-dashed border-primary bg-[#F6F5FF] text-primary hover:text-white"
          onClick={() => appendAudience({ type: "", entity: "" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add another audience group
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Folder
        </Button>
      </form>
    </Form>
  );
};

export default UpsertFolderForm;
