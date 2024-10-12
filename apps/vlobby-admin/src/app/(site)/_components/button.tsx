import { cn } from '@repo/ui/lib/utils';
import React from 'react';

export const Button: React.FC<{
  children?: React.ReactNode;
  className?: string;
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  as?: React.ElementType;
  [x: string]: any;
}> = ({
  children,
  className,
  variant = 'primary',
  as: Tag = 'button',
  ...props
}) => {
  const variantClass =
    variant === 'simple'
      ? 'bg-secondary relative z-10 bg-transparent hover:border-secondary hover:bg-secondary/50  border border-transparent text-white text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center'
      : variant === 'outline'
        ? 'bg-white relative z-10 hover:bg-secondary/90 hover:shadow-xl  text-black border border-black hover:text-black text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center'
        : variant === 'primary'
          ? 'bg-secondary relative z-10 hover:bg-secondary/90  border border-secondary text-black text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF60_inset,_0px_1px_0px_0px_#FFFFFF60_inset]'
          : variant === 'muted'
            ? 'bg-neutral-800 relative z-10 hover:bg-neutral-900  border border-transparent text-white text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center shadow-[0px_1px_0px_0px_#FFFFFF20_inset]'
            : '';
  return (
    <Tag
      className={cn(
        'bg-secondary relative z-10 hover:bg-secondary/90 group hover:-translate-y-0.5 active:scale-[0.98] text-black text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center',
        variantClass,
        className
      )}
      {...props}
    >
      {children ?? `Get Started`}
    </Tag>
  );
};
