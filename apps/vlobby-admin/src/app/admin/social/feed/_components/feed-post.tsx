"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FeedPostFormData } from "../_forms/feed-validation";
import { format } from "date-fns";
import { Badge } from "@tremor/react";
import { cn } from "@repo/ui/lib/utils";
import { getUser } from "../../../../../clerk-server/clerk";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";

/**
 * @interface PostContentProps
 * @description Defines the structure of props for the PostContent component.
 * @property {string} title - The title of the post.
 * @property {string} content - The main content of the post.
 * @property {Array<{url: string, storageId: string}>} images - An array of image objects for the post.
 */
interface PostContentProps {
  content: string;
  images: Array<{
    url: string;
    storageId: string;
  }>;
}

/**
 * @function PostContent
 * @description A component that renders the content of a post, including title, text, and images.
 * @param {PostContentProps} props - The props for the PostContent component.
 * @returns {JSX.Element} The rendered PostContent component.
 */
function PostContent({ content, images }: PostContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert">
      <p>{content}</p>
      {images.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-1 gap-4",
            images.length > 1 && "md:grid-cols-2",
          )}
        >
          {images.map((image, index) => (
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
    </div>
  );
}

/**
 * @interface FeedPostProps
 * @description Defines the structure of props for the FeedPost component.
 * @property {FeedPostFormData} post - The post data to be displayed in the feed.
 */
interface FeedPostProps {
  post: FeedPostFormData;
}

/**
 * @function FeedPost
 * @description A component that displays a single post in the social feed.
 * It renders a card with the post's title, content, and images.
 *
 * @param {FeedPostProps} props - The props for the FeedPost component.
 * @returns {JSX.Element} The rendered FeedPost component.
 */
export default function FeedPost({ post }: FeedPostProps) {
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      if (post.authorId) {
        const user = await getUser(post.authorId);
        setAuthorName(`${user.assignedFirstName} ${user.assignedLastName}`);
      }
    };
    void fetchAuthor();
  }, [post.authorId]);

  return (
    <div className="mx-auto w-full max-w-2xl pt-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="font-medium">{post.title}</div>
            {post.isAdmin && <Badge>Admin Post</Badge>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">By {authorName}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(post._creationTime!), "PPP")} •{" "}
              {format(new Date(post._creationTime!), "p")}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <PostContent content={post.content} images={post.images} />
        </CardContent>
      </Card>
    </div>
  );
}
