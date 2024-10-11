"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckIcon, XIcon } from "lucide-react";
import { FeedPostFormData } from "../_forms/feed-validation";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { api } from "@repo/backend/convex/_generated/api";
import { getUser } from "../../../../../clerk-server/clerk";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { toast } from "@repo/ui/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { UserCoreDetails } from "../../../../lib/app-data/app-types";

interface PendingPostProps {
  post: FeedPostFormData;
}

export function PendingPost({ post }: PendingPostProps) {
  const [isFading, setIsFading] = useState(false);

  const setFeedPostStatus = useMutation(api.feed.setFeedPostStatus);

  const author = useQuery(api.allUsers.getUserById, {
    userId: post?.authorId ?? '',
  }) as UserCoreDetails;

  const handleAction = async (newStatus: "approved" | "rejected") => {
    setIsFading(true);

    try {
      await setFeedPostStatus({
        ids: [post._id as Id<"feedPosts">],
        status: newStatus,
      });

      toast({
        title: `Post ${newStatus}`,
        description: `The post "${post.title}" has been ${newStatus}.`,
      });
    } catch (error) {
      console.error(`Error updating post status:`, error);
      toast({
        title: "Action failed",
        description: `Failed to update the post status. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsFading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl pt-2">
      <Card
        className={`transition-opacity duration-500 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">{post.title}</h2>
              <p className="text-sm text-muted-foreground">By {author?.firstname} {author?.lastname}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(post._creationTime!), "PPP")} •{" "}
                {format(new Date(post._creationTime!), "p")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="text-green-500 hover:bg-green-500 hover:text-green-50"
                onClick={() => handleAction("approved")}
                disabled={isFading}
              >
                <CheckIcon className="h-4 w-4" />
                <span className="sr-only">Approve</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:bg-red-500 hover:text-red-50"
                onClick={() => handleAction("rejected")}
                disabled={isFading}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Reject</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div
              className={cn(
                "grid grid-cols-1 gap-4",
                post.images.length > 1 && "md:grid-cols-2",
              )}
            >
              {post.images.map((image, index) => (
                <div key={index} className="relative aspect-video w-full">
                  <Image
                    src={image.url}
                    alt={`Post Image ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
