import React from 'react';
import { Badge } from '@tremor/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { IssueIconPath } from '../../../lib/icons/icons';
import ImageGalleryComponent from '../../_components/global-components/image-gallery';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useMutation } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';

interface TicketDetailsProps {
  id: string;
  type: string;
  tags: string[];
  priority: string;
  assignedTo: string;
  description: string;
  images: string[];
  status: string;
}

export default function TicketDetailsCard({
  id,
  type,
  tags,
  priority,
  assignedTo,
  description,
  images,
  status,
}: TicketDetailsProps) {
  const updateIssueStatus = useMutation(api.tickets.updateIssueStatus);

  const handleStatusChange = (newStatus: string) => {
    updateIssueStatus({ status: newStatus, issueId: id as Id<'issues'> });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <CardTitle className="text-md flex flex-row items-center justify-between font-medium w-full">
          <div className="flex flex-row items-center gap-2 w-full">
            <svg
              className="h-5 w-5 fill-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
            >
              {IssueIconPath()}
            </svg>
            Ticket Details
          </div>
          <Select onValueChange={handleStatusChange} defaultValue={status}>
            <SelectTrigger className="w-[210px]">
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <DetailItem label="Type" value={type} isBadge={true} />
          <DetailItem label="Priority" value={priority} isBadge={true} />
          <DetailItem label="Assigned to" value={assignedTo} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Tags</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} color={'purple-400'}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="text-sm">{description}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Images</p>
          <ImageGalleryComponent images={images} />
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  isBadge = false,
}: {
  label: string;
  value: string;
  isBadge?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {isBadge ? (
        <Badge color={getBadgeColor(label, value)}>
          {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
        </Badge>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}

function getBadgeColor(label: string, value?: string): string {
  switch (label.toLowerCase()) {
    case 'type':
      return 'blue-400';
    case 'tags':
      return 'green-400';
    case 'category':
      return 'orange-400';
    case 'priority':
      if (value) {
        switch (value.toLowerCase()) {
          case 'low':
            return 'green-400';
          case 'medium':
            return 'orange-400';
          case 'high':
            return 'red-400';
          default:
            return 'gray-400';
        }
      }
      return 'gray-400';
    default:
      return 'gray-400';
  }
}
