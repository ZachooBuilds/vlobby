"use client";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { ImagePlaceholder } from "../../../lib/app-data/static-data";
// IMPORTS

  type BannerImage = {
    url: string;
    storageId: Id<"_storage">;
    // Add other properties if they exist in the iconImage object
  };

// COMPONENT - Main component function
export default function SettingsBanner() {
  const bannerImage = useQuery(api.theme.getBannerImage) as BannerImage;
  const organization = useOrganization();
  const siteProfile = organization.organization?.imageUrl;
  const siteName = organization.organization?.name;
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <Image
          src={bannerImage?.url ?? ImagePlaceholder}
          alt="Page not found"
          className="h-[300px] w-full rounded-sm object-cover object-top"
          width={1600}
          height={800}
          unoptimized
        />
      </div>
      <div className="mt-[-40px] flex w-full flex-row items-end pl-4">
        <div className="flex items-end justify-center rounded-md bg-background p-2">
          <Image
            src={siteProfile ?? ""}
            alt="Page not found"
            className="h-16 w-16 rounded-sm object-contain object-center"
            width={400}
            height={600}
          />
        </div>
        <p className="pl-4 text-lg font-semibold">{siteName}</p>
      </div>
    </div>
  );
}
