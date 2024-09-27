"use client";

import { useQuery } from "convex/react";
import FeatureControlToggle from "./_components/feature-setting";
import { api } from "@repo/backend/convex/_generated/api";
// Define types for the feature data
type FeatureListItem = {
  _id: string;
  feature: string;
  description: string;
};

type FeatureItem = {
  feature: string;
  enabled: boolean;
};

export default function SettingsPage() {
  const featuresListData = useQuery(api.features.getAllFeaturesFromList);
  const featuresData = useQuery(api.features.getAllFeatures);

  // Create a map of features with their enabled status
  const featuresMap = new Map(
    featuresData?.map((f: FeatureItem) => [f.feature, f.enabled]),
  );

  return (
    <main className="flex h-full w-full flex-col items-start justify-start overflow-scroll rounded-md bg-background p-4">
      <div className="grid w-full grid-cols-2 gap-4">
        {featuresListData?.map((feature: FeatureListItem) => (
          <FeatureControlToggle
            key={feature._id}
            feature={feature.feature}
            description={feature.description}
            enabled={featuresMap.get(feature.feature) ?? false}
          />
        ))}
      </div>
    </main>
  );
}
