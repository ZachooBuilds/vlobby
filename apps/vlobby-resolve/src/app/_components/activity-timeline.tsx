'use client';

import React, { useMemo } from 'react';
import { Badge } from '@tremor/react';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { colorsList } from '../../lib/staticData';

export interface TimelineItem {
  _id: string;
  title: string;
  description: string;
  _creationTime: string;
  type: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  // Create a color mapping for space types
  const typeColorMap = useMemo(() => {
    const uniqueTypes = Array.from(new Set(items.map((item) => item.type)));
    return Object.fromEntries(
      uniqueTypes.map((type, index) => [
        type,
        colorsList[index % colorsList.length]?.hex ?? '#000000',
      ])
    );
  }, [items]);

  return (
    <div className="relative flex flex-col gap-4 p-4">
      {items.map((item, index) => (
        <div key={item._id} className="relative flex w-full flex-row gap-4">
          {/* Vertical line */}
          {index !== items.length - 1 && (
            <div className="absolute left-5 top-12 h-full w-px bg-muted"></div>
          )}
          <div className="relative z-0 flex h-full flex-col items-center">
            <Avatar
              style={{
                borderColor: typeColorMap[item.type],
                borderWidth: '2px',
              }}
            >
              <AvatarFallback> + </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex w-full flex-col">
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col">
                <p className="text-md font-semibold">
                  {item.title}
                  {index === 0 && (
                    <Badge size="xs" className="ml-2">
                      Latest
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item._creationTime).toLocaleString()}
                </p>
              </div>
              <Badge
                className="flex flex-row gap-1"
                size="xs"
                style={{
                  backgroundColor: `${typeColorMap[item.type]}20`,
                  border: `0.5px solid ${typeColorMap[item.type]}`,
                  color: typeColorMap[item.type],
                }}
              >
                {item.type}
              </Badge>
            </div>
            <p className="text-sm text-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
