"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Trash, Plus } from "lucide-react";
import Image from "next/image";
import { completeOnboarding } from "../../actions/_actions";
import { useRouter } from "next/navigation";
import {
  useOrganizationList,
} from "@clerk/nextjs";
import {
  MultiStageFormData,
  MultiStageFormSchema,
} from "./onboarding-validation";
import { createOrganization } from "../../actions/_actions";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { Confetti } from "@neoconfetti/react";
import { ConfettiColors } from "../../../lib/app-data/static-data";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@repo/backend/convex/_generated/api";
import WindowSearchPreview from "@repo/ui/components/global-components/window-view";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type FeatureListItem = {
  feature: string;
};

/**
 * OnboardingForm Component
 * 
 * This component handles the multi-stage onboarding process for new users.
 * It includes form validation, organization creation, and site setup.
 */
const OnboardingForm = () => {
  // State management for current stage, loading state, and confetti display
  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [url, setUrl] = useState("");

  // Hooks for navigation, toast notifications, and organization management
  const { toast } = useToast();
  const router = useRouter();
  const { isLoaded, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // Effect to trigger confetti on the final stage
  useEffect(() => {
    if (currentStage === 3) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  // Confetti rendering function
  const renderConfetti = () => (
    <Confetti
      particleCount={400}
      particleSize={5}
      colors={ConfettiColors}
    />
  );

  // Form setup using react-hook-form with zod validation
  const methods = useForm<MultiStageFormData>({
    resolver: zodResolver(MultiStageFormSchema),
  });

  // Field array for managing dynamic floor inputs
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "stage2.namedFloors",
  });

  // Convex mutations and queries
  const createOrUpdateSiteMutation = useMutation(api.site.upsertSite);
  const addAllFeatures = useMutation(api.features.addAllFeatures);
  const featuresListData = useQuery(api.features.getAllFeaturesFromList);

  /**
   * Form submission handler
   * Manages the entire onboarding process including organization creation,
   * site setup, and feature addition
   */
  const onSubmit = async (data: MultiStageFormData) => {
    setIsLoading(true);
    console.log(data);

    try {
      // Create the organization
      const orgResult = await createOrganization(
        data.stage1.tenantName,
        data.stage1.domainSlug,
      );

      console.log(orgResult);

      if (orgResult.message && isLoaded) {
        await setActive({ organization: orgResult.message });
        // Complete the onboarding process
        const res = await completeOnboarding();

        if (res?.message) {

          // Prepare and add features
          const features =
            featuresListData?.map((featureListItem: FeatureListItem) => ({
              feature: featureListItem.feature,
            })) ?? [];

          const res = await addAllFeatures({ features });

          if (res) {
            // Display success toast and redirect to dashboard
            toast({
              title: " 🎊 🎉 🥳 | Onboarding Completed",
              description: (
                <div className="flex items-center space-x-2">
                  <span>Taking you to your dashboard</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ),
              duration: 1000,
            });
            router.push("/admin/dashboard");
          }
        }
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast({
        title: "Onboarding Error",
        description:
          "There was an error during the onboarding process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for stage transitions
  const stageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState([0, 0]);

  // Function to handle page transitions
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // Handlers for next and previous stage navigation
  const handleNext = async () => {
    const isValid = await methods.trigger(
      `stage${currentStage}` as keyof MultiStageFormData,
    );
    if (isValid && currentStage < 3) {
      setCurrentStage((prev) => prev + 1);
      paginate(1);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
      paginate(-1);
    }
  };

  // Function to render content for each stage
  const renderStageContent = () => {
    return (
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Left column: Image or WindowSearchPreview */}
        <div className="flex flex-col items-center justify-center">
          {currentStage === 1 ? (
            <WindowSearchPreview url={url} />
          ) : (
            <AspectRatio ratio={1}>
              <Image
                src={`/onboarding-hero-${currentStage}.png`}
                alt={`Onboarding Stage ${currentStage}`}
                fill
                className="rounded-md object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/onboarding-placeholder.webp";
                }}
              />
            </AspectRatio>
          )}
        </div>

        {/* Right column: Form fields */}
        <div className="space-y-4">
          {currentStage === 1 && (
            <>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Let&apos;s Get You Set Up!
                </h2>
                <p className="text-sm text-muted-foreground">
                  To complete your account setup, let&apos;s create your first
                  project instance. This is where you&apos;ll control each site
                  or development. You need to give it a name and a slug, which
                  is the URL you&apos;ll use to access it. For example, if your
                  project is called &quot;Skyline Towers&quot;, your slug could
                  be &quot;skyline-towers&quot; and the url would be
                  &quot;https://skyline-towers.vlobby.app&quot;.
                </p>
              </div>

              <FormField
                control={methods.control}
                name="stage1.tenantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Account, Project or Site Name - It&apos;s Up to You!
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter something" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="stage1.domainSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain Path</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter something"
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          setUrl(event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {currentStage === 2 && (
            <>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Let&apos;s Add Your First Site or Building
                </h2>
                <p className="text-sm text-muted-foreground">
                  Now, let&apos;s add the first site or building to your project
                  or account. You&apos;ll be able to provide basic information
                  about this space. Don&apos;t worry about getting everything
                  perfect - you can always add more details, configure
                  additional spaces, and make changes once the onboarding
                  process is complete.
                </p>
              </div>
              <FormField
                control={methods.control}
                name="stage2.siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter site name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="stage2.siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description"
                        className="resize-vertical"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="stage2.floors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Floors</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of floors"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <p className="text-sm font-medium">Named Floors</p>
                <p className="text-xs text-muted-foreground">
                  Add the floors in your building and give them names for easy
                  reference.
                </p>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-row items-end justify-start gap-2"
                >
                  <FormField
                    control={methods.control}
                    name={`stage2.namedFloors.${index}.index`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        {index === 0 && <FormLabel>Floor Number</FormLabel>}
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter floor number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`stage2.namedFloors.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        {index === 0 && <FormLabel>Floor Name</FormLabel>}
                        <FormControl>
                          <Input placeholder="Enter floor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ index: 0, name: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Named Floor
              </Button>
            </>
          )}
          {currentStage === 3 && (
            <>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome to Vlobby!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Congratulations! Your basic setup is complete. You&apos;re now
                  ready to jump into your dashboard and start using Vlobby.
                </p>
                <p className="text-sm text-muted-foreground">
                  For further customization, visit the settings page to
                  configure additional elements. But at this basic level,
                  you&apos;re all set to go!
                </p>
              </div>
            </>
          )}

          {/* Navigation buttons */}
          <div className="flex flex-row justify-end gap-2 pt-4">
            {currentStage > 1 && (
              <Button type="button" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStage < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <div className="justify-cen flex w-full flex-row items-center gap-0 pb-20 md:justify-center md:gap-10">
        {[
          { stage: 1, name: "Complete account registration" },
          { stage: 2, name: "Configure first site" },
          { stage: 3, name: "Complete" },
        ].map(({ stage, name }) => (
          <div
            key={stage}
            className="flex flex-row items-center justify-start gap-5"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                currentStage >= stage ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              {stage}
            </div>
            <div
              className={`text-sm ${currentStage === stage ? "font-semibold text-primary" : "text-muted-foreground"}`}
            >
              {name}
            </div>
          </div>
        ))}
      </div>

      {currentStage === 3 && (
        <div className="flex w-full flex-col items-center justify-center">
          {showConfetti && renderConfetti()}
        </div>
      )}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={stageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
        >
          <FormProvider {...methods}>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {renderStageContent()}
              </form>
            </Form>
          </FormProvider>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default OnboardingForm;
