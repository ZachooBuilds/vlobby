"use client";

import { api } from "@repo/backend/convex/_generated/api";
import { Switch } from "@repo/ui/components/ui/switch";
import { useMutation} from "convex/react";

// pass the id of the feature so that its status can be fetched and toggled
type Props = {
  feature: string;
  description: string;
  enabled: boolean;
};

export default function FeatureControlToggle({ description, feature, enabled }: Props) {
  const updateFeature = useMutation(api.features.updateFeature);

  if (!feature) return null; // or a loading state

  const handleToggle = async (checked: boolean) => {
    try {
      await updateFeature({ feature, enabled: checked });
    } catch (error) {
      console.error("Failed to update feature:", error);
    }
  };

  return (
    <div className="flex w-full flex-row items-center justify-between gap-10 rounded-sm p-3 dark:border-none">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">{feature}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={feature} checked={enabled} onCheckedChange={handleToggle} />
    </div>
  );
}
