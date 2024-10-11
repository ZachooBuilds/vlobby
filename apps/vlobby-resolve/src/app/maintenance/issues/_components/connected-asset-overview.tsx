'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import React from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { SpacesIconPath } from '../../../../../public/svg/icons';

interface EntityDetailsProps {
  space: string;
  floor: string;
  location: string;
  loggedBy: string;
  email: string;
}

export default function ConnectAssetDetailsCard({
  space,
  floor,
  location,
  loggedBy,
  email,
}: EntityDetailsProps) {
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
        <Button variant="secondary" className="mt-4 w-full">
          Contact Issue Creator
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
