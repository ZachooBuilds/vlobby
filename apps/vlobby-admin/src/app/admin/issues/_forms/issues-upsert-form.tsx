'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { issueFormSchema, IssueFormData } from './issues-validation';
import { useMutation, useQuery } from 'convex/react';
import useSheetStore from '../../../lib/global-state/sheet-state';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { ValueLabelPair } from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { getOrgUsers } from '../../../../clerk-server/clerk';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { IssueTypeToggle } from '../../_components/custom-form-fields/issue-type-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Button } from '@repo/ui/components/ui/button';
import { cn } from '@repo/ui/lib/utils';
import { Calendar } from '@repo/ui/components/ui/calendar';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { FancyMultiSelect } from '../../_components/custom-form-fields/multi-select-field';
import { FileUploadWithPreview } from '../../_components/custom-form-fields/file-upload-form-field';
import { Input } from '@repo/ui/components/ui/input';

type Props = {
  selectedIssue?: IssueFormData;
};

const TicketUpsertForm = ({ selectedIssue }: Props) => {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //

  const upsertIssueMutation = useMutation(api.tickets.upsertIssue);

  // ---------------------------------------------------- //

  const formattedIssue = selectedIssue
    ? {
        ...selectedIssue,
        followUpDate: selectedIssue.followUpDate
          ? new Date(selectedIssue.followUpDate)
          : undefined,
      }
    : undefined;

  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: formattedIssue,
  });

  // -------------- BACKEND QUERIES -------------- //

  const getLocations = useQuery(
    api.tickets.getAllTicketLocationsValueLabelPair
  ) as ValueLabelPair[];

  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs
  ) as ValueLabelPair[];

  const getFacilities = useQuery(
    api.facilities.getAllFacilityValueLabelPairs
  ) as ValueLabelPair[];

  const getIssueTypes = useQuery(
    api.tickets.getAllTicketTypesValueLabelPair
  ) as ValueLabelPair[];

  const getSites = useQuery(
    api.site.getAllSitesValueLabelPairs
  ) as ValueLabelPair[];

  // Update the getFloorList query based on the value of buildingId
  const getFloorList = useQuery(
    api.site.getFloorListValueLabelPairs,
    form.watch('buildingId')
      ? { id: form.watch('buildingId') as Id<'sites'> }
      : 'skip'
  ) as { value: number; label: string }[] | undefined;

  // Fetch users from clerk
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = (await getOrgUsers()) ?? [];
      setUsers(fetchedUsers);
      setIsLoading(false);
    };

    void fetchUsers();
  }, []);
  // ---------------------------------------------------- //

  const onSubmit = async (data: IssueFormData) => {
    setIsLoading(true);

    // Map files to an array of storage IDs
    const mappedFiles = data.files?.map((file) => file.storageId) ?? [];

    try {
      await upsertIssueMutation({
        ...data,
        files: mappedFiles,
        facilityId: data.facilityId as Id<'facilities'>,
        spaceId: data.spaceId as Id<'spaces'>,
        buildingId: data.buildingId as Id<'sites'>,
        locationId: data.locationId as Id<'ticketLocations'>,
        _id: selectedIssue?._id as Id<'issues'>,
        followUpDate: data.followUpDate
          ? data.followUpDate.toISOString()
          : undefined,
        // Add any other fields that need to be transformed or added
      });

      setIsLoading(false);
      toast({
        title: 'Issue Saved',
        description: 'The issue has been successfully saved.',
      });
      form.reset();
      if (selectedIssue) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save the issue. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving issue:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="issueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Type</FormLabel>
              <FormControl>
                <IssueTypeToggle
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select the type of issue</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Rest of the form fields */}
          {form.watch('issueType') === 'facility' && (
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility (Optional) </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.resetField('spaceId');
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getFacilities?.map((facility) => (
                        <SelectItem key={facility.value} value={facility.value}>
                          {facility.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the facility where the issue is located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('issueType') === 'space' && (
            <FormField
              control={form.control}
              name="spaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space (Optional) </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.resetField('facilityId'); // Reset facilityId when spaceId changes
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select space" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getSpaces?.map((space) => (
                        <SelectItem key={space.value} value={space.value}>
                          {space.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the space where the issue is located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('issueType') === 'general' && (
            <>
              <FormField
                control={form.control}
                name="buildingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select building" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getSites?.map((site) => (
                          <SelectItem key={site.value} value={site.value}>
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the issue location</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getFloorList?.map((site) => (
                          <SelectItem
                            key={site.value}
                            value={site.value.toString()}
                          >
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the issue Floor</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getLocations?.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the issue location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the issue priority</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Assign the issue to a user</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="followUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow Up Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date('2100-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Set a follow-up date for the issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Provide a brief summary of the issue
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter issue description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of the issue
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Tags</FormLabel>
              <FormControl>
                <FancyMultiSelect
                  options={getIssueTypes ?? []} // Replace with actual tag options
                  initialSelected={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="Select tags..."
                />
              </FormControl>
              <FormDescription>
                Add relevant issue categorey tags to help with reporting &
                allocation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full">
          <FileUploadWithPreview
            name="files"
            label="Issue Images (Max 5)"
            multiple={true}
            maxFiles={5}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Issue
        </Button>
      </form>
    </Form>
  );
};

export default TicketUpsertForm;
