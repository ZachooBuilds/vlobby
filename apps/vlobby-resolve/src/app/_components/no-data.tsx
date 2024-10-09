'use client';

import { Badge } from '@tremor/react';
import { UnderConstructionImage } from '../../../public/svg/icons';

interface NoDataProps {
  badgeText: string;
  title: string;
  description: string;
}

export default function NoData({ badgeText, title, description }: NoDataProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 pt-10">
      <div className="space-y-4 text-center">
        <Badge size="xs">{badgeText}</Badge>
        <h1 className="text-xl font-semibold tracking-tighter sm:text-lg md:text-xl">
          {title}
        </h1>
        <p className="max-w-[600px] text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <UnderConstructionImage />
    </div>
  );
}
