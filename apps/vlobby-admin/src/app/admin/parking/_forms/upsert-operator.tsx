'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useOrganization } from '@clerk/nextjs';
import { operatorSchema, Operator } from './operator-validation';
import { useToast } from '@repo/ui/hooks/use-toast';
import useSheetStore from '../../../lib/global-state/sheet-state';
import { api } from '@repo/backend/convex/_generated/api';
import { addUser } from '../../../../clerk-server/clerk';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Card } from '@repo/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';

type Props = {
  selectedOperator?: Operator;
};

const OperatorUpsertForm = ({ selectedOperator }: Props) => {
  console.log(
    'OperatorUpsertForm rendered with selectedOperator:',
    selectedOperator
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<Operator>({
    resolver: zodResolver(operatorSchema),
    defaultValues: selectedOperator,
  });

  const { isLoaded, organization } = useOrganization();
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const upsertOperator = useMutation(api.parkingOperators.upsertOperator);

  async function onSubmit(data: Operator) {
    console.log('onSubmit called with data:', data);
    setIsLoading(true);

    try {
      if (!isLoaded || !organization) {
        console.error('Organization not loaded');
        throw new Error('Organization not loaded');
      }

      console.log('Adding user to Clerk');
      // Add user to Clerk
      const { userId } = await addUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: '', // Add a default value or get from form
        parcelPreference: 'notify', // Add a default value or get from form
      });
      console.log('User added to Clerk with userId:', userId);

      // Check if user is already a member of the organization
      console.log('Checking if user is already a member of the organization');
      const members = await organization.getMemberships();
      const isAlreadyMember = members.data.some(
        (member) => member.publicUserData.userId === userId
      );
      console.log('Is user already a member?', isAlreadyMember);

      // Add user to organization if not already a member
      if (!isAlreadyMember) {
        console.log('Adding user to organization');
        try {
          await organization.addMember({
            userId: userId,
            role: 'org:resolve_user',
          });
          console.log('User added to organization');
        } catch (error) {
          console.error('Failed to add user to organization:', error);
          throw new Error(
            'Failed to add user to organization. Please check permissions and try again.'
          );
        }
      } else {
        console.log('User is already a member of the organization');
      }

      // Upsert operator in Convex database
      console.log('Upserting operator in Convex database');
      const result = await upsertOperator({
        _id: selectedOperator?._id as Id<'operators'>,
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      console.log('Operator upserted with result:', result);

      toast({
        title: 'Operator saved successfully',
        description: 'Successfully updated operator details',
      });

      form.reset();
      if (selectedOperator) {
        closeSheet();
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: 'Error',
        description: 'Failed to add operator. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      console.log('onSubmit completed');
    }
  }

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedOperator ? 'Update Operator' : 'Add Operator'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default OperatorUpsertForm;
