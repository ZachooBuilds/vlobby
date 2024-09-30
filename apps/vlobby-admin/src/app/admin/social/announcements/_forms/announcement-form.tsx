"use client";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash, Plus, CalendarIcon } from "lucide-react";


import {
  AnnouncementFormData,
  announcementFormSchema,
} from "./announcement-validation";

import { useMutation } from "convex/react";
import { useToast } from "@repo/ui/hooks/use-toast";
import useSheetStore from "../../../../lib/global-state/sheet-state";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card } from "@repo/ui/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { TimePicker } from "@repo/ui/components/custom-form-fields/time-picker/time-picker";
import Tiptap from "@repo/ui/components/custom-form-fields/rich-editor";
import AudienceField from "../../../_components/custom-form-fields/audience-form-field";

type Props = {
  selectedAnnouncement?: AnnouncementFormData;
};

const AnnouncementUpsertForm = ({ selectedAnnouncement }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const upsertAnnouncementMutation = useMutation(api.announcements.upsertAnnouncement);
  const deleteAnnouncementMutation = useMutation(api.announcements.deleteAnnouncement);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: selectedAnnouncement ?? {
      scheduleSend: false,
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

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsLoading(true);

    try {
      await upsertAnnouncementMutation({
        ...data,
        _id: selectedAnnouncement?._id as Id<"announcements">,
        dateTime: data.dateTime?.toISOString(),
      });

      setIsLoading(false);
      toast({
        title: "Announcement Saved",
        description: "The announcement has been successfully saved.",
      });
      form.reset();
      if (selectedAnnouncement) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save the announcement. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving announcement:", error);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAnnouncementMutation({
        id: selectedAnnouncement?._id as Id<"announcements">,
      });
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete the announcement. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          {/* Title and Type fields */}
          <div className="flex flex-row items-start justify-start gap-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Alert">Alert</SelectItem>
                        <SelectItem value="Info">Info</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Schedule Send toggle */}
          <FormField
            control={form.control}
            name="scheduleSend"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Schedule Send?</FormLabel>
                  <FormDescription>
                    Toggle to schedule the announcement for a later time
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

          {/* Date and Time picker (conditionally rendered) */}
          {form.watch("scheduleSend") && (
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="border-t border-border p-3">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Rich text editor for content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Tiptap
                    onChange={field.onChange}
                    initialContent={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col items-start justify-start gap-2">
            <p className="text-sm font-medium">Audience</p>
            <p className="text-xs text-muted-foreground">
              An audience defines who the announcement is targeted at. We
              provide different options so you can configure this to ensure the
              message is relayed only to the people you want. The type specifies
              the category, such as a user or a particular floor. The entity is
              the specific value, such as user Jane Doe or floor 7.
            </p>
          </div>
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

          {/* Submit button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedAnnouncement ? "Update Announcement" : "Add Announcement"}
          </Button>

          {selectedAnnouncement && (
            <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
              <h3 className="text-lg font-semibold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting this announcement is irreversible. Please proceed with
                caution.
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Delete Announcement
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default AnnouncementUpsertForm;
