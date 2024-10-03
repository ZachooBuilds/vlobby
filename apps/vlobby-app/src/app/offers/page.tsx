'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUser, useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import NavigationBar from '../_components/navigation';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@repo/ui/components/ui/input';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { OfferDetails } from '../../lib/app-types';
import OfferCard from './_components/offers-card';
import { OffersIconPath } from '../../../public/svg/icons';
import { Badge } from '@tremor/react';

function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="relative mb-4 w-full">
      <Search className="absolute left-2 top-3 h-6 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search offers..."
        className="pl-8 text-base h-12"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

function OfferGrid({
  offers,
  isLoading,
}: {
  offers?: OfferDetails[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 items-start justify-start gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <p className="col-span-full text-center text-muted-foreground">
        No offers found.
      </p>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 items-start justify-start gap-2 md:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard
          key={offer._id}
          offer={offer}
          imageUrl={offer.files[0]?.url ?? ''}
        />
      ))}
    </div>
  );
}

export default function OffersPage() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { isLoaded: isOrgLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const offers = useQuery(api.offers.getAllOffersForUpdate) as OfferDetails[];

  useEffect(() => {
    if (isUserLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isUserLoaded, isSignedIn, router]);

  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    return offers.filter((offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [offers, searchTerm]);

  if (!isUserLoaded || !isOrgLoaded || !isSignedIn || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <OffersIconPath />
            </div>
            <h2 className="text-xl font-semibold">Site Offers</h2>
            <Badge size="sm" color="blue">
              {offers?.length}
            </Badge>
          </div>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <OfferGrid offers={filteredOffers} isLoading={offers === undefined} />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
