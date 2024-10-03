'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import NavigationBar from '../_components/navigation';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@repo/ui/components/ui/input';
import { Announcement, OfferDetails } from '../../lib/app-types';
import {
  AnnouncementIconPath,
  ClubIconPath,
  FeedIconPath,
  NoticesIconPath,
} from '../../../public/svg/icons';
import { Badge } from '@tremor/react';
import AnnouncementsOverview from './_components/announcements';
import { motion } from 'framer-motion';
import FeedOverview from './_components/feed';
import ClubsOverview from './_components/clubs';

// ... existing SearchBar component ...

export default function SocialPage() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { isLoaded: isOrgLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('Announcements');

  const offers = useQuery(api.offers.getAllOffersForUpdate) as OfferDetails[];

  useEffect(() => {
    if (isUserLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isUserLoaded, isSignedIn, router]);

  if (!isUserLoaded || !isOrgLoaded || !isSignedIn || !user) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <PageHeader offersCount={offers?.length} />
          <SocialOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          {selectedOption === 'Announcements' && <AnnouncementsOverview />}
          {selectedOption === 'Feed' && <FeedOverview />}
          {selectedOption === 'Clubs' && <ClubsOverview />}
          {/* TODO: Implement SearchBar component */}
          {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}

// ... existing LoadingSpinner component ...

function PageHeader({ offersCount }: { offersCount?: number }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="w-5 h-5 fill-foreground">
        <NoticesIconPath />
      </div>
      <h2 className="text-xl font-semibold">Social</h2>
      <Badge size="sm" color="blue">
        {offersCount}
      </Badge>
    </div>
  );
}

function SocialOptions({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) {
  const options = [
    { name: 'Announcements', icon: AnnouncementIconPath },
    { name: 'Feed', icon: FeedIconPath },
    { name: 'Clubs', icon: ClubIconPath },
  ];

  return (
    <div className="flex flex-row w-full">
      {options.map((option) => {
        const isSelected = selectedOption === option.name;
        return (
          <motion.div
            key={option.name}
            className={`flex flex-col gap-2 items-center p-4 rounded cursor-pointer flex-1 ${
              isSelected ? 'bg-primary text-white' : 'text-muted-foreground'
            }`}
            onClick={() => setSelectedOption(option.name)}
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: isSelected ? 1 : 0.8,
              scale: isSelected ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-4 h-4 ${isSelected ? 'fill-white' : 'fill-muted-foreground'}`}
            >
              <option.icon />
            </div>
            <p className="text-sm">{option.name}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
