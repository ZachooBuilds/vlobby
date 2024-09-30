'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';

import { FeedPostFormData, feedPostSchema } from './feed-validation';
import { useToast } from '@repo/ui/hooks/use-toast';
import useSheetStore from '../../../../lib/global-state/sheet-state';
import { api } from '@repo/backend/convex/_generated/api';
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
import { Textarea } from '@repo/ui/components/ui/textarea';
import { FileUploadWithPreview } from '../../../_components/custom-form-fields/file-upload-form-field';
import { Switch } from '@repo/ui/components/ui/switch';
import { Button } from '@repo/ui/components/ui/button';

type Props = {
  selectedPost?: FeedPostFormData;
};

const FeedPostUpsertForm = ({ selectedPost }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [instantApprove, setInstantApprove] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const upsertFeedPostMutation = useMutation(api.feed.upsertFeedPost);
  const deleteFeedPostMutation = useMutation(api.feed.deleteFeedPost);

  const form = useForm<FeedPostFormData>({
    resolver: zodResolver(feedPostSchema),
    defaultValues: selectedPost ?? {
      title: '',
      content: '',
      images: [],
      status: 'pending',
    },
  });

  const onSubmit = async (data: FeedPostFormData) => {
    setIsLoading(true);

    try {
      await upsertFeedPostMutation({
        ...data,
        _id: selectedPost?._id as Id<'feedPosts'>,
        images: data.images.map((image) => image.storageId),
        isAdmin: true,
        status: instantApprove ? 'approved' : data.status,
      });

      setIsLoading(false);
      toast({
        title: 'Feed Post Saved',
        description: 'The feed post has been successfully saved.',
      });
      form.reset();
      if (selectedPost) {
        closeSheet();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save the feed post. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving feed post:', error);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteFeedPostMutation({
        id: selectedPost?._id as Id<'feedPosts'>,
      });
      toast({
        title: 'Feed Post Deleted',
        description: 'The feed post has been successfully deleted.',
      });
      closeSheet();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to delete the feed post. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting feed post:', error);
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll border-none p-1 shadow-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter post content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Offer Image Upload */}
          <div className="flex w-full">
            <FileUploadWithPreview
              name="images"
              label="Post Images (Max 20)"
              multiple={true}
              maxFiles={20}
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Instant Approval</label>
              <p className="text-sm text-muted-foreground">
                Automatically approve this post upon submission
              </p>
            </div>
            <Switch
              checked={instantApprove}
              onCheckedChange={setInstantApprove}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {selectedPost ? 'Update Feed Post' : 'Add Feed Post'}
          </Button>

          {selectedPost && (
            <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
              <h3 className="text-lg font-semibold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting this feed post is irreversible. Please proceed with
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
                Delete Feed Post
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default FeedPostUpsertForm;
