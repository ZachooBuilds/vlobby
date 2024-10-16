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
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@repo/ui/components/ui/avatar';
import ImageGalleryComponent from '../../../_components/image-gallery';
import {
  ActivityTimeline,
  TimelineItem,
} from '../../../_components/activity-timeline';
import NoData from '../../../_components/no-data';
import { AdminUser, EnhancedIssue } from '../../../../lib/app-types';
import useDrawerStore from '../../../../lib/global-state';
import { GlobalNoteData } from '../_form/global-note-form';
import Link from 'next/link';
import GlobalNote from '../_form/global-note';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Id } from '@repo/backend/convex/_generated/dataModel';

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
      <Card className="w-full p-4">
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
        <CardFooter className="flex flex-col gap-2">
          <StatusUpdate issueId={issue._id} status={issue.status} />

          <Button onClick={onClose} variant="outline" className="w-full h-14">
            Back to Issues
          </Button>
        </CardFooter>
      </Card>
      {issue.assignedToId && (
        <AssignedUserDetails userId={issue.assignedToId} />
      )}
      <NotesTab issueId={issue._id} />
      <ActivityFeed issueId={issue._id} />
    </div>
  );
}

function StatusUpdate({
  issueId,
  status,
}: {
  issueId: string;
  status: string;
}) {
  const updateIssueStatus = useMutation(api.tickets.updateIssueStatus);

  const handleStatusChange = (newStatus: string) => {
    updateIssueStatus({ status: newStatus, issueId: issueId as Id<'issues'> });
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue={status}>
      <SelectTrigger className="w-full h-14">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            Pending
          </div>
        </SelectItem>
        <SelectItem value="Assigned">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
            Assigned
          </div>
        </SelectItem>
        <SelectItem value="In Progress">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
            In Progress
          </div>
        </SelectItem>
        <SelectItem value="Resolved">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            Resolved
          </div>
        </SelectItem>
        <SelectItem value="Closed">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            Closed
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-md">
          We are taking care of this issue
        </CardTitle>
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

/**
 * @function NotesTab
 * @description Handles the display of notes related to the issue
 * @param {Object} props - Component props
 * @param {string} props.issueId - The ID of the issue
 * @returns {JSX.Element} Rendered component for the Notes tab
 */
function NotesTab({ issueId }: { issueId: string }) {
  const noteData = useQuery(api.notes.getAllGlobalNotes, {
    noteType: 'issue',
    entityId: issueId,
  }) as GlobalNoteData[];

  if (noteData === undefined || noteData.length < 1) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">Notes</CardTitle>
          <Link
            href={`/maintenance/issues/new-note?issueId=${issueId}`}
            passHref
          >
            <Button variant={'outline'}>Add Note</Button>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NoData
            badgeText={'No notes found'}
            title={'No notes found'}
            description={'No notes have been added for this issue.'}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">Notes</CardTitle>
        <Link href={`/maintenance/issues/new-note?issueId=${issueId}`} passHref>
          <Button variant={'outline'}>Add Note</Button>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {noteData.length > 0 && (
          <>
            <div className="flex flex-row gap-2">
              <p className="text-md font-medium">All Notes</p>
              <Badge size={'xs'}>{noteData.length} Total</Badge>
              <Badge size={'xs'} color={'gray'}>
                {noteData.filter((note) => !note.isPrivate).length} Public
              </Badge>
              <Badge size={'xs'} color={'gray'}>
                {noteData.filter((note) => note.isPrivate).length} Private
              </Badge>
            </div>
            {noteData.map((note) => (
              <GlobalNote key={note._id} {...note} />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
