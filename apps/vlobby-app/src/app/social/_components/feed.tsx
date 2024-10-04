'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@repo/ui/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@tremor/react';
import { cn } from '@repo/ui/lib/utils';
import { PostData } from '../../../lib/app-types';
import { FeedIconPath } from '../../../../public/svg/icons';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../../lib/global-state';
import FeedPostUpsertForm from '../_forms/new-post';
import { useRouter } from 'next/navigation';

function PageHeader() {
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const router = useRouter();

  const handleNewPost = () => {
    router.push('/social/new-post');
  };

  return (
    <div className="flex flex-row w-full items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <div className="w-4 h-4 fill-foreground">
          <FeedIconPath />
        </div>
        <h2 className="text-base font-semibold">Building Feed</h2>
      </div>
      <Button onClick={handleNewPost}>New Post</Button>
    </div>
  );
}

export default function FeedOverview() {
  const posts = useQuery(api.feed.getAllFeedPosts) as PostData[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <PageHeader />
      {posts?.map((post) => (
        <Card key={post._id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="font-medium">{post.title}</div>
              {post.isAdmin && <Badge>Admin Post</Badge>}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                By {'Not Configured'}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(post._creationTime!), 'PPP')} •{' '}
                {format(new Date(post._creationTime!), 'p')}
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-gray dark:prose-invert">
              <p>{post.content}</p>
              {post.images.length > 0 && (
                <div
                  className={cn(
                    'grid grid-cols-1 gap-4',
                    post.images.length > 1 && 'md:grid-cols-2'
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
