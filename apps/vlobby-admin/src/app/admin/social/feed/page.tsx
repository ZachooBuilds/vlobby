"use client";

import { useQuery } from "convex/react";
import SocialNavigation from "../_components/social-navigation";
import { PendingPost } from "./_components/pending-post";
import FeedPost from "./_components/feed-post";
import FeedPostUpsertForm from "./_forms/feed_post_form";
import { FeedPostFormData } from "./_forms/feed-validation";
import { Badge } from "@tremor/react";
import { TableSkeleton } from "../../_components/skeletons/table-loading-skeleton";
import NoData from "../../_components/global-components/no-data";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../../_components/global-components/section-header";

/**
 * FeedPage Component
 *
 * This component represents the main page for managing social feed posts.
 * It includes functionality for reviewing pending posts, approving posts,
 * and displaying the current feed.
 */
export default function FeedPage() {
  const FeedContentLoader = ({
    posts,
    isLoading,
  }: {
    posts: FeedPostFormData[] | undefined;
    isLoading: boolean;
  }) => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (!posts || posts.length === 0) {
      return (
        <NoData
          badgeText="Where are your feed posts?"
          title="No Feed Posts"
          description="No feed posts have been added yet. Add a new post to get started."
          buttonText="Add Feed Post"
          formComponent={<FeedPostUpsertForm />}
          sheetTitle="Add New Feed Post"
          sheetDescription="Enter details to add a new feed post"
        />
      );
    }

    return (
      <>
        {/* List of approved posts in the feed */}
        {posts?.map((post) => <FeedPost key={post._id} post={post} />)}
      </>
    );
  };

  const feedPosts = useQuery(api.feed.getAllFeedPosts) as FeedPostFormData[];

  const pendingPosts = useQuery(
    api.feed.getPendingFeedPosts,
  ) as FeedPostFormData[];

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <SectionHeader
        title="Social"
        description="Create and manage feed posts to engage with your community. Review pending posts from occupants and share important updates or interesting content."
        buttonText="New Post"
        sheetTitle="Create Feed Post"
        sheetDescription="Create a new feed post"
        sheetContent={"FeedPostUpsertForm"}
        icon="Feed"
      />
      <SocialNavigation />
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-4">
        <div className="flex flex-row items-center gap-4">
          <div className="text-md font-medium">Pending Posts</div>
          <Badge size="xs">{pendingPosts?.length} posts</Badge>
        </div>
        {pendingPosts?.map((post) => (
          <PendingPost key={post._id} post={post} />
        ))}

        <div className="flex flex-row items-center gap-4">
          <div className="text-md font-medium">Occupant Feed</div>
          <Badge size="xs">{feedPosts?.length} posts</Badge>
        </div>
        <FeedContentLoader
          posts={feedPosts}
          isLoading={feedPosts === undefined}
        />
      </div>
    </div>
  );
}
