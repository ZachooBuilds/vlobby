'use client';
import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@repo/ui/components/ui/card';
import { Badge } from '@tremor/react';
import { Button } from '@repo/ui/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@repo/ui/components/ui/avatar';
import ImageGalleryComponent from '../../../_components/image-gallery';
import { ActivityTimeline, TimelineItem } from '../../../_components/activity-timeline';
import NoData from '../../../_components/no-data';
import { AdminUser, EnhancedIssue } from '../../../../lib/app-types';

interface IssueOverviewProps {
  issue: EnhancedIssue;
  onClose: () => void;
}

export default function IssueOverview({ issue, onClose }: IssueOverviewProps) {
  const priorityColor =
    issue.priority.toLowerCase() === 'high'
      ? 'red'
      : issue.priority.toLowerCase() === 'medium'
        ? 'orange'
        : 'green';

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-md">{issue.title}</CardTitle>
          <div className="flex flex-row gap-2">
            <Badge size="xs">
              {issue.issueType.charAt(0).toUpperCase() +
                issue.issueType.slice(1)}
            </Badge>
            <Badge size="xs" color={priorityColor}>
              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
            </Badge>
            <Badge size="xs">{issue.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Logged: {format(new Date(issue._creationTime), 'MMM d, yyyy HH:mm')}
          </p>
          <h3 className="text-md font-semibold mb-2">Description</h3>
          <p className="text-sm">{issue.description}</p>
          {issue.locationId && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Location</h3>
              <p className="text-sm">{issue.locationName}</p>
            </div>
          )}
          {issue.files && issue.files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Attachments</h3>
              <ImageGalleryComponent
                images={issue.files.map((file) => file.url)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} variant="outline" className="w-full">
            Back to Issues
          </Button>
        </CardFooter>
      </Card>
      {issue.assignedToId && (
        <AssignedUserDetails userId={issue.assignedToId} />
      )}
      <ActivityFeed issueId={issue._id} />
    </div>
  );
}

function AssignedUserDetails({ userId }: { userId: string }) {
  const assignedUser = useQuery(api.allUsers.getUserById, {
    userId,
  }) as AdminUser;

  if (!assignedUser) {
    return <p>Loading assigned user details ...</p>;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-md">Assigned User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${assignedUser.firstname}%20${assignedUser.lastname}`}
            />
            <AvatarFallback>
              {assignedUser.firstname[0]}
              {assignedUser.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {assignedUser.firstname} {assignedUser.lastname}
            </p>
            <p className="text-sm text-muted-foreground">
              {assignedUser.email}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {assignedUser.firstname} is making sure this issue gets resolved.
          We'll notify you with updates.
        </p>
      </CardFooter>
    </Card>
  );
}

function ActivityFeed({ issueId }: { issueId: string }) {
  const activityData = useQuery(api.activity.getEntityActivity, {
    entityId: issueId,
    isUserActivity: true,
  }) as TimelineItem[];

  if (activityData === undefined || activityData.length < 1) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NoData
            badgeText={'No activity found'}
            title={'No activity recorded'}
            description={'No activity has been recorded for this space.'}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium">Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ActivityTimeline items={activityData} />
      </CardContent>
    </Card>
  );
}
