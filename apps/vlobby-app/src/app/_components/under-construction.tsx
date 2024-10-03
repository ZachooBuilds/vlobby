import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@tremor/react';
import { UnderConstructionImage } from '../../../public/svg/icons';

interface UnderConstructionMessageProps {
  badgeText?: string;
  title?: string;
  description?: string;
}

export default function UnderConstructionMessage({
  badgeText = 'Under Construction',
  title = 'Exciting New Experience',
  description = 'We are working hard to bring you something amazing. Stay tuned!',
}: UnderConstructionMessageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="space-y-4 text-center">
        <Badge color="purple" size="xs">
          {badgeText}
        </Badge>
        <h1 className="text-xl font-semibold tracking-tighter sm:text-lg md:text-xl">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <UnderConstructionImage />
    </div>
  );
}
