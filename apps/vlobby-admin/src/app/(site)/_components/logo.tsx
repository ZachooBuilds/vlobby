import { Link } from 'next-view-transitions';
import React from 'react';
import { LogoIconPath } from '../../lib/icons/icons';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >
      <div className="w-6 h-6">
        <LogoIconPath />
      </div>
      <span className="text-foreground font-bold text-md">VLobby</span>
    </Link>
  );
};
