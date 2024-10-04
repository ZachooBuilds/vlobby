'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useToast } from '@repo/ui/hooks/use-toast';
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
import { Button } from '@repo/ui/components/ui/button';
import { FeedPostFormData, feedPostSchema } from './post-validation';
import useDrawerStore from '../../../lib/global-state';
import { FileUploadWithPreview } from '../../_components/file-upload-form-field';
import { useRouter } from 'next/navigation';

type Props = {
  selectedPost?: FeedPostFormData;
};

const FeedPostUpsertForm = ({ selectedPost }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [instantApprove, setInstantApprove] = useState(false);
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const upsertFeedPostMutation = useMutation(api.feed.upsertFeedPost);
  const deleteFeedPostMutation = useMutation(api.feed.deleteFeedPost);

  const form = useForm<FeedPostFormData>({
    resolver: zodResolver(feedPostSchema),
    defaultValues: selectedPost ?? {
      title: '',
      content: '',
      images: [],
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FeedPostFormData) => {
    setIsLoading(true);

    try {
      await upsertFeedPostMutation({
        ...data,
        _id: selectedPost?._id as Id<'feedPosts'>,
        images: data.images.map((image) => image.storageId),
        isAdmin: false,
        status: 'pending',
      });

      setIsLoading(false);
      toast({
        title: 'Feed Post Saved',
        description: 'The feed post has been successfully saved.',
      });
      form.reset();
      if (selectedPost) {
        router.back();
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
      closeDrawer();
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
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="text-base"
                  />
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
                  <Textarea
                    placeholder="Enter post content"
                    {...field}
                    className="text-base"
                  />
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
