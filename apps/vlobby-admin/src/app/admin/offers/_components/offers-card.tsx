"use client";
import Image from "next/image";
import { Badge } from "@tremor/react";
import { EyeIcon, Percent, ScanBarcode } from "lucide-react";

import { useMutation, useQuery } from "convex/react";


import OfferUpsertForm, { OfferFormValues } from "../_forms/upsert-offer";

import { OfferCategory } from "../../settings/general/_tables/offer-categories-table";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { api } from "@repo/backend/convex/_generated/api";
import { toast } from "@repo/ui/hooks/use-toast";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { Card, CardDescription, CardTitle } from "@repo/ui/components/ui/card";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui/components/ui/alert-dialog";

/**
 * @interface OfferCardProps
 * @description Defines the structure of props for the OfferCard component.
 * @property {OfferFormValues} offer - The offer data to be displayed in the card.
 * @property {string} imageUrl - The URL of the image to be shown for the offer.
 */
interface OfferCardProps {
  offer: OfferFormValues;
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
  console.log("OfferCard rendered with offer:", offer);
  console.log("Image URL:", imageUrl);

  // Access global state functions from the sheet store
  const openSheet = useSheetStore((state) => state.openSheet);
  const deleteOffer = useMutation(api.offers.deleteOffer);

  /**
   * @function handleOpenAssetDetails
   * @description Opens the edit sheet for the current offer.
   * It uses the global openSheet function to display the OfferUpsertForm.
   */
  const handleOpenAssetDetails = () => {
    console.log("Opening asset details for offer:", offer.title);
    openSheet(
      "Facility Details",
      "Use the options below to edit an existing role configure permissions and access to device groups.",
      <OfferUpsertForm selectedOffer={offer} />,
    );
  };

  /**
   * @function handleDelete
   * @description Handles the deletion of the current offer.
   * It calls the deleteOffer mutation and displays a success or error toast.
   */
  const handleDelete = async () => {
    try {
      await deleteOffer({ id: offer?._id as Id<"offers"> });
      toast({
        title: "Offer Deleted",
        description: "The offer has been successfully deleted.",
      });
    } catch (Error) {
      toast({
        title: "Error",
        description: "Failed to delete the offer. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting offer:", Error);
    }
  };

  // Fetch the offer category name using a Convex query
  const typeName = useQuery(api.offers.getOfferCategory, {
    id: offer.type as Id<"offerCategories">,
  }) as OfferCategory;

  console.log("Offer category:", typeName);

  return (
    <Card className="flex h-full flex-col justify-between gap-2 p-2 dark:border-none">
      {/* Offer image: Displays the offer's image in a 16:9 aspect ratio */}
      <AspectRatio ratio={16 / 9}>
        <Image
          src={imageUrl}
          alt={offer.title}
          fill
          className="rounded-md object-cover"
          unoptimized
        />
      </AspectRatio>
      {/* Offer type badge: Shows the offer category with a custom color */}
      <div className="flex w-full flex-row gap-2 overflow-hidden">
        <Badge
          className="flex flex-row gap-1"
          icon={Percent}
          style={{
            backgroundColor: `${offer.colour}20`,
            border: `0.5px solid ${offer.colour}`,
            color: offer.colour,
          }}
        >
          {typeName?.name}
        </Badge>
      </div>
      {/* Offer title and description: Displays the main information about the offer */}
      <CardTitle className="text-md font-medium">{offer.title}</CardTitle>
      <CardDescription>{offer.offerDescription}</CardDescription>
      {/* Usage statistics: Shows view and scan counts (currently placeholder values) */}
      <p className="text-sm text-muted-foreground">Usage Overview</p>
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <EyeIcon className="h-4 w-4 text-muted-foreground" />
          <p className="text-md font-medium">{0}</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <ScanBarcode className="h-4 w-4 text-muted-foreground" />
          <p className="text-md font-medium">{0}</p>
        </div>
      </div>
      {/* Edit and Delete buttons: Provide actions for modifying or removing the offer */}
      <div className="flex flex-row gap-4">
        <Button
          className="flex-1"
          variant={"secondary"}
          onClick={handleOpenAssetDetails}
        >
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="flex-1 hover:bg-destructive hover:text-white"
              variant={"outline"}
            >
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                offer &quot;{offer.title}&quot; and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
