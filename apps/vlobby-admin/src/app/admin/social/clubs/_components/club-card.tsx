"use client";

import Image from "next/image";
import { Badge } from "@tremor/react";
import { Clock, MapPin, Calendar } from "lucide-react";
import useSheetStore from "../../../../lib/global-state/sheet-state";
import { Card, CardDescription, CardTitle } from "@repo/ui/components/ui/card";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";

// Define the properties for the ClubCard component
interface ClubCardProps {
  id: string;
  imageUrl: string;
  clubType: string;
  badgeColor: string;
  title: string;
  description: string;
  location: string;
  time: string;
  day: string;
}

export default function ClubCard({
  id,
  imageUrl,
  clubType,
  badgeColor,
  title,
  description,
  location,
  time,
  day,
}: ClubCardProps) {
  const openSheet = useSheetStore((state) => state.openSheet);

  const handleOpenClubDetails = () => {
    openSheet(
      "Club Details",
      "View more details about this club and its activities.",
    );
  };

  return (
    <Card className="flex h-full flex-col gap-2 p-2 dark:border-none">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="rounded-md object-cover"
        />
      </AspectRatio>
      <div className="flex w-full flex-row gap-2 overflow-hidden">
        <Badge color={badgeColor as "red" | "blue" | "green" | "orange"}>
          {clubType}
        </Badge>
      </div>
      <CardTitle className="text-md font-medium">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>{day}</span>
        </div>
      </div>
      <Button variant="secondary" onClick={handleOpenClubDetails}>
        More Details
      </Button>
    </Card>
  );
}
