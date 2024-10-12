'use client';
// import { Button } from "../button";
import { NavBarItem } from './navbar-item';
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from 'framer-motion';
import { cn } from '@repo/ui/lib/utils';
import { useState } from 'react';
import { Link } from 'next-view-transitions';
import { Logo } from '../logo';
import { Button } from '@repo/ui/components/ui/button';
import { ModeToggle } from '../../../admin/_components/global-components/dark-mode-toggle';

type Props = {
  navItems: {
    link: string;
    title: string;
    target?: '_blank';
  }[];
};

export const DesktopNavbar = ({ navItems }: Props) => {
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <motion.div
      className={cn(
        'w-full flex relative justify-between px-4 py-3 rounded-md transition duration-200 bg-transparent mx-auto'
      )}
      animate={{
        width: showBackground ? '80%' : '100%',
        background: showBackground
          ? 'hsl(var(--background) / 0.8)'
          : 'transparent',
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }} // Updated this line
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 h-full w-full  pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent,white)] rounded-full"
          />
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2 items-center">
        <Logo />
        <div className="flex items-center gap-1.5 text-foreground">
          {navItems.map((item) => (
            <NavBarItem href={item.link} key={item.title} target={item.target}>
              {item.title}
            </NavBarItem>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <Link href="/admin/dashboard">
          <Button className="text-white">Go to dashboard</Button>
        </Link>
        <Button variant="outline">Book a demo</Button>
        <ModeToggle />
      </div>
    </motion.div>
  );
};
