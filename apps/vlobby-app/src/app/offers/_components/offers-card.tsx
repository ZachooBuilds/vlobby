'use client';
import Image from 'next/image';
import { Badge } from '@tremor/react';
import { Percent } from 'lucide-react';

import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Card, CardDescription, CardTitle } from '@repo/ui/components/ui/card';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { OfferCategory, OfferDetails } from '../../../lib/app-types';

/**
 * @interface OfferCardProps
 * @description Defines the structure of props for the OfferCard component.
 * @property {OfferFormValues} offer - The offer data to be displayed in the card.
 * @property {string} imageUrl - The URL of the image to be shown for the offer.
 */
interface OfferCardProps {
  offer: OfferDetails;
  imageUrl: string;
}

/**
 * @function OfferCard
 * @description A component that displays details of an offer and provides edit/delete functionality.
 * It renders a card with the offer's image, title, description, and usage statistics.
 * It also includes buttons for editing and deleting the offer.
 *
 * @param {OfferCardProps} props - The props for the OfferCard component.
 * @returns {JSX.Element} The rendered OfferCard component.
 */
export default function OfferCard({ offer, imageUrl }: OfferCardProps) {
  // Fetch the offer category name using a Convex query
  const typeName = useQuery(api.offers.getOfferCategory, {
    id: offer.type as Id<'offerCategories'>,
  }) as OfferCategory;

  console.log('Offer category:', typeName);

  return (
    <Card className="flex flex-col justify-between gap-2 p-2 dark:border-none">
      {/* Offer image: Displays the offer's image in a 16:9 aspect ratio */}
      <AspectRatio ratio={16 / 7} className="relative">
        <Image
          src={imageUrl}
          alt={offer.title}
          fill
          className="rounded-md object-cover"
          unoptimized
        />
        {/* Offer type badge: Shows the offer category with a custom color */}
        <div className="absolute left-2 top-2">
          <Badge
            className="flex flex-row gap-1"
            style={{
              backgroundColor: `white`,
              border: `1px solid ${offer.colour}`,
              color: offer.colour,
            }}
          >
            {typeName?.name}
          </Badge>
        </div>
      </AspectRatio>
      {/* Offer title and description: Displays the main information about the offer */}
      <CardTitle className="text-md font-medium">{offer.title}</CardTitle>
      <CardDescription>{offer.offerDescription}</CardDescription>
    </Card>
  );
}
