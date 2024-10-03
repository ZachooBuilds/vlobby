import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Button } from '@repo/ui/components/ui/button';
import { useToast } from '@repo/ui/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

const requestSchema = z.object({
  requestType: z.enum(['pickup:item', 'pickup:vehicle']),
  notes: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface RequestVehicleFormProps {
  vehicleId: string;
  onSuccess?: () => void;
}

export function RequestVehicleForm({
  vehicleId,
  onSuccess,
}: RequestVehicleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const upsertRequest = useMutation(api.requests.upsertRequest);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      requestType: 'pickup:vehicle',
      notes: '',
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    setIsLoading(true);
    try {
      await upsertRequest({
        requestType: data.requestType,
        vehicleId: vehicleId,
        notes: data.notes,
      });
      toast({
        title: 'Request Submitted',
        description: 'Vehicle request submitted successfully.',
      });
      if (onSuccess) {
        onSuccess();
      }
      form.reset();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="requestType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pickup:item">Pickup Item</SelectItem>
                  <SelectItem value="pickup:vehicle">Pickup Vehicle</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter any additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Request
        </Button>
      </form>
    </Form>
  );
}
