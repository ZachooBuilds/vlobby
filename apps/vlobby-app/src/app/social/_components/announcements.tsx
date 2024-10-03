'use client';

import React from 'react';
import { AnnouncementIconPath } from '../../../../public/svg/icons';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Announcement } from '../../../lib/app-types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import Tiptap from '@repo/ui/components/custom-form-fields/rich-editor';
import { format } from 'date-fns';
import { Badge } from '@tremor/react';
import { colorsList } from '../../../lib/staticData';

export default function AnnouncementsOverview() {
  const announcements = useQuery(
    api.announcements.getAllOccupantAnnouncements
  ) as Announcement[];

  const getColorForType = (type: string) => {
    const typeColorMap = {
      Alert: colorsList[0]?.hex,
      Info: colorsList[1]?.hex,
      Event: colorsList[2]?.hex,
      Maintenance: colorsList[3]?.hex,
      Other: colorsList[4]?.hex,
    };
    return (
      typeColorMap[type as keyof typeof typeColorMap] || colorsList[0]?.hex
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {announcements?.map((announcement) => (
        <Card key={announcement._id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <div className="w-4 h-4">
                  <AnnouncementIconPath />
                </div>
                <span className="text-base font-medium">
                  {announcement.title}
                </span>
              </div>
              <Badge
                style={{
                  backgroundColor: `${getColorForType(announcement.type)}20`,
                  border: `0.5px solid ${getColorForType(announcement.type)}`,
                  color: getColorForType(announcement.type),
                }}
              >
                {announcement.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-2 text-sm text-gray-500">
              {announcement.dateTime
                ? format(new Date(announcement.dateTime), 'MMMM d, yyyy')
                : 'Date not available'}
            </div>
            <Tiptap initialContent={announcement.content} isViewer={true} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
