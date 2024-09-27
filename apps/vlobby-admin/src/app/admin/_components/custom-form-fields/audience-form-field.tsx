import React from "react";
import { useFormContext, Controller } from "react-hook-form";

import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { ValueLabelPair } from "../../../lib/app-data/app-types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { FormControl, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

type AudienceFieldProps = {
  index: number;
  buildingId?: string;
};

const AudienceField = ({ index, buildingId }: AudienceFieldProps) => {
  const { control, watch } = useFormContext();
  const selectedType = watch(`audience.${index}.type`) as string;

  const occupants = useQuery(api.occupants.getAllOccupantsValueLabelPair) as ValueLabelPair[];
  const buildings = useQuery(api.site.getAllSitesValueLabelPairs) as ValueLabelPair[];
  const spaces = useQuery(api.spaces.getAllSpaceValueLabelPairs) as ValueLabelPair[];
  const spaceTypes = useQuery(api.spaces.getAllSpaceTypesValueLabelPair) as ValueLabelPair[];

  console.log("building ID in audience field :", buildingId);

  //get floor list based on if a building has been selected
  const getFloorList = useQuery(
    api.site.getFloorListValueLabelPairs,
    watch("buildingId") || buildingId
      ? { id: (watch("buildingId") || buildingId) as Id<"sites"> }
      : "skip",
  ) as ValueLabelPair[] ;

  const fetchEntities = (type: string): ValueLabelPair[] => {
    switch (type) {
      case "floor":
        if (!buildingId) return [];
        return getFloorList ?? [];
      case "occupant":
        return occupants ?? [];
      case "building":
        return buildings ?? [];
      case "space":
        return spaces ?? [];
      case "spaceType":
        return spaceTypes ?? [];
      default:
        return [];
    }
  };

  const entities = fetchEntities(selectedType);

  return (
    <div className="flex w-full flex-row items-end justify-start gap-2">
      {/* Audience Type Field */}
      <Controller
        control={control}
        name={`audience.${index}.type`}
        render={({ field }) => (
          <FormItem className="w-full">
            {index === 0 && <FormLabel>Type</FormLabel>}
            <Select
              onValueChange={(value) => {
                field.onChange(value);
              }}
              defaultValue={field.value as string}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="floor">Floor</SelectItem>
                <SelectItem value="occupant">User</SelectItem>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="space">Space</SelectItem>
                <SelectItem value="spaceType">Space Type</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Audience Entity Field */}
      <Controller
        control={control}
        name={`audience.${index}.entity`}
        render={({ field }) => (
          <FormItem className="w-full">
            {index === 0 && <FormLabel>Entity</FormLabel>}
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {entities ? (
                  entities.map((entity) => (
                    <SelectItem key={entity.value} value={entity.value}>
                      {entity.label}
                    </SelectItem>
                  ))
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AudienceField;
