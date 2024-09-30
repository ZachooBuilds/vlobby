"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import useSheetStore from '../../../lib/global-state/sheet-state';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { ValueLabelPair } from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from "@repo/ui/components/ui/input";
import {
  Location,
  Level,
  ParkingSpot,
  locationSchema,
  levelSchema,
  parkingSpotSchema,
} from './parking-validation';
import { FileUploadWithPreview } from "../../_components/custom-form-fields/file-upload-form-field";



// Location Form
export function LocationForm({
  selectedLocation,
}: {
  selectedLocation?: Location | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();

  const upsertLocationMutation = useMutation(api.parking.upsertLocation);
  const removeLocationMutation = useMutation(api.parking.removeLocation);

  const form = useForm<Location>({
    resolver: zodResolver(locationSchema),
    defaultValues: selectedLocation ?? { name: "" },
  });

  const onSubmit = async (data: Location) => {
    setIsLoading(true);
    try {
      await upsertLocationMutation({
        ...data,
        _id: selectedLocation?._id as Id<"parkingLocations">,
      });
      toast({
        title: "Location Saved",
        description: "The location has been successfully saved.",
      });
      form.reset();
      if (selectedLocation) closeSheet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the location. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving location:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await removeLocationMutation({
        id: selectedLocation?._id as Id<"parkingLocations">,
      });
      toast({
        title: "Location Deleted",
        description: "The location has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the location. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting location:", error);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter location name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedLocation ? "Update Location" : "Add Location"}
        </Button>

        {selectedLocation && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this location is irreversible. Please proceed with
              caution.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Location
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

// Level Form
export function LevelForm({ selectedLevel }: { selectedLevel?: Level | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { toast } = useToast();

  const upsertLevelMutation = useMutation(api.parking.upsertParkingLevel);
  const removeLevelMutation = useMutation(api.parking.removeParkingLevel);
  const locations = useQuery(
    api.parking.getAllLocationsValueLabelPair,
  ) as ValueLabelPair[];

  const form = useForm<Level>({
    resolver: zodResolver(levelSchema),
    defaultValues: selectedLevel ?? {
      name: "",
      locationId: "",
      image: [],
    },
  });

  const onSubmit = async (data: Level) => {
    setIsLoading(true);
    try {
      await upsertLevelMutation({
        ...data,
        _id: selectedLevel?._id as Id<"parkingLevels">,
        locationId: data.locationId as Id<"parkingLocations">,
        image: data.image as { url: string; storageId: string }[],
      });
      toast({
        title: "Level Saved",
        description: "The level has been successfully saved.",
      });
      form.reset();
      if (selectedLevel) closeSheet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the level. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving level:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await removeLevelMutation({
        id: selectedLevel?._id as Id<"parkingLevels">,
      });
      toast({
        title: "Level Deleted",
        description: "The level has been successfully deleted.",
      });
      closeSheet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the level. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting level:", error);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter level name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Offer Image Upload */}
        <div className="flex w-full">
          <FileUploadWithPreview
            name="image"
            label="Level Image"
            multiple={false}
            maxFiles={1}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedLevel ? "Update Level" : "Add Level"}
        </Button>

        {selectedLevel && (
          <div className="mt-8 rounded-md border border-destructive/20 p-4 transition-all duration-300 ease-in-out hover:border-destructive">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this level is irreversible. Please proceed with caution.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Level
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

// Update the ParkingSpotForm
export function ParkingSpotForm({
  selectedSpot,
  levelId,
  onSubmit,
}: {
  selectedSpot?: ParkingSpot | null;
  levelId: Id<"parkingLevels">;
  onSubmit: (data: ParkingSpot) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ParkingSpot>({
    resolver: zodResolver(parkingSpotSchema),
    defaultValues: selectedSpot ?? { name: "", levelId: levelId, x: 0, y: 0 },
  });

  const handleSubmit = async (data: ParkingSpot) => {
    setIsLoading(true);
    try {
      onSubmit(data);
      toast({
        title: "Parking Spot Saved",
        description: "The parking spot has been successfully saved.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the parking spot. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving parking spot:", error);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spot Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter spot name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedSpot ? "Update Parking Spot" : "Add Parking Spot"}
        </Button>
      </form>
    </Form>
  );
}
