'use client';

/**
 * @file KeyRegisterUpsertForm Component
 * @description This component provides a form for adding or updating key register information.
 * It uses react-hook-form for form handling and Zod for validation.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { KeyFormData, keyFormSchema } from './key-validation';
import useSheetStore from '../../../lib/global-state/sheet-state';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { ValueLabelPair } from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Button } from '@repo/ui/components/ui/button';

/**
 * @interface KeyFormProps
 * @description Defines the props for the KeyRegisterUpsertForm component
 */
type KeyFormProps = {
  selectedKey?: KeyFormData;
};

/**
 * @function KeyUpsertForm
 * @description The main component for adding or updating key register information
 * @param {KeyRegisterFormProps} props - The component props
 * @returns {JSX.Element} The rendered KeyRegisterUpsertForm component
 */
export default function KeyUpsertForm({ selectedKey }: KeyFormProps) {
  // -------------- STATE & GENERAL CONFIG -------------- //
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();
  // ---------------------------------------------------- //

  // -------------- BACKEND QUERIES -------------- //
  /**
   * @constant spaceOptions
   * @description Fetches all spaces as value-label pairs for the space dropdown
   */
  const getSpaces = useQuery(
    api.spaces.getAllSpaceValueLabelPairs
  ) as ValueLabelPair[];

  /**
   * @constant keyTypeOptions
   * @description Fetches all key types as value-label pairs for the key type dropdown
   */
  const getKeyTypes = useQuery(
    api.keys.getAllKeyTypesValueLabelPair
  ) as ValueLabelPair[];
  // ---------------------------------------------------- //

  // -------------- BACKEND MUTATIONS -------------- //
  /**
   * @constant upsertKeyMutation
   * @description Mutation for adding or updating a key
   */
  const upsertKeyMutation = useMutation(api.keys.upsertKey);

  const deleteKeyMutation = useMutation(api.keys.removeKeyType);
  // ---------------------------------------------------- //

  /**
   * @constant form
   * @description Initializes the form with react-hook-form and Zod validation
   */
  const form = useForm<KeyFormData>({
    resolver: zodResolver(keyFormSchema),
    defaultValues: selectedKey ?? {
      keyId: '',
      keyTypeId: '',
      notes: '',
      spaceId: '',
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteKeyMutation({
        id: selectedKey?._id as Id<'keyTypes'>,
      });
      toast({
        title: 'Key Deleted',
        description: 'The key has been successfully deleted.',
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to delete the key. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting key:', error);
    }
  };

  /**
   * @function onSubmit
   * @description Handles form submission
   * @param {StorageFormData} data - The form data to be submitted
   */
  const onSubmit = async (data: KeyFormData) => {
    setIsLoading(true);

    try {
      await upsertKeyMutation({
        ...data,
        _id: selectedKey?._id as Id<'keys'>,
      });

      setIsLoading(false);
      toast({
        title: 'Key Saved',
        description: 'The key has been successfully saved.',
      });
      form.reset();
      if (selectedKey) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save the key. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving key:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="keyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter key ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keyTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getKeyTypes?.map((keyType) => (
                    <SelectItem key={keyType.value} value={keyType.value}>
                      {keyType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
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
                Select the space associated with this key
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {selectedKey ? 'Update Key' : 'Add Key'}
        </Button>

        {selectedKey && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this key is irreversible. Please proceed with caution.
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
              Delete Key
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
