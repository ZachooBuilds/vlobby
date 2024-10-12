'use client';
import { useState } from 'react';
import Link from 'next/link';
import { IoIosMenu, IoIosClose } from 'react-icons/io';
import { Logo } from '../logo';
import { Button } from '@repo/ui/components/ui/button';
import { LogoIconPath } from '../../../lib/icons/icons';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '../../../admin/_components/global-components/dark-mode-toggle';

export const MobileNavbar = ({
  navItems,
}: {
  navItems: Array<{ title: string; link: string }>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col w-full bg-background rounded-md">
      <div className="flex flex-row justify-between items-center px-4 py-2">
        <div className="flex flex-row items-center gap-2">
          <Image src={'/logonw.png'} alt="Logo" width={24} height={24} />
          <span className="text-foreground font-bold text-md">VLobby</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoIosClose size={24} /> : <IoIosMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-start p-4 space-y-4 overflow-hidden"
          >
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">{item.title}</span>
              </Link>
            ))}
            <div className="flex flex-row gap-2 w-full">
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Book a demo
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Register
              </Button>
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
