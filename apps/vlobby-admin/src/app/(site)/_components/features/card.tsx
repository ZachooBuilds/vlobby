import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'p-8 rounded-xl border border-muted bg-background/80 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn('text-lg font-semibold text-foreground py-2', className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        'text-sm font-normal text-muted-foreground max-w-sm',
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        'h-[20rem] rounded-xl z-40',
        className,
        showGradient &&
          ' bg-background/80 [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]'
      )}
    >
      {children}
    </div>
  );
};
