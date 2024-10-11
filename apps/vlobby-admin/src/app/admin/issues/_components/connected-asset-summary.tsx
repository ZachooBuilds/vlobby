import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import React from 'react';
import { SpacesIconPath } from '../../../lib/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { ChatSummary } from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';

interface EntityDetailsProps {
  space: string;
  floor: string;
  location: string;
  loggedBy: string;
  email: string;
  userId: string;
}

export default function ConnectAssetDetailsCard({
  space,
  floor,
  location,
  loggedBy,
  email,
  userId,
}: EntityDetailsProps) {
  const occupantChatId = useQuery(api.chats.getChatByUserId, {
    userId: userId,
  }) as ChatSummary;

  const router = useRouter();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {SpacesIconPath()}
          </svg>
          Connected Asset Details
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DetailItem label="Location" value={space} />
        <DetailItem label="Floor" value={floor} />
        <DetailItem label="Location" value={location} />
        <DetailItem label="Logged By" value={loggedBy} />
        <DetailItem label="Email" value={email} />
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => {
            if (occupantChatId) {
              router.push(
                `/admin/communication?selectedChatId=${occupantChatId}`
              );
            }
          }}
        >
          Contact Occupant
        </Button>
      </CardFooter>
    </Card>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
