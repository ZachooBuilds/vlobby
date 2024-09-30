"use client";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { OfferFormValues } from "./_forms/upsert-offer";
import { Search } from "lucide-react";
import OfferCard from "./_components/offers-card";
import SectionHeader from "../_components/global-components/section-header";
import { Input } from "@repo/ui/components/ui/input";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { api } from "@repo/backend/convex/_generated/api";

/**
 * @function PageHeader
 * @description Renders the header section of the Offers page.
 * It includes a title, description, and a button to add a new offer.
 * @returns {JSX.Element} The rendered PageHeader component.
 */
function PageHeader() {
  return (
    <SectionHeader
      title="Offers"
      description="Manage and view all offers for your property. You can add new offers, update existing ones, and assign them to specific categories or time periods for effective promotion management."
      buttonText="Add Offer"
      sheetTitle="Add New Offer"
      sheetDescription="Enter details to create a new offer"
      sheetContent={"OfferUpsertForm"}
      icon={"Offers"}
    />
  );
}

/**
 * @function SearchBar
 * @description Renders a search input field for filtering offers.
 * @param {Object} props - The component props.
 * @param {string} props.searchTerm - The current search term.
 * @param {function} props.setSearchTerm - Function to update the search term.
 * @returns {JSX.Element} The rendered SearchBar component.
 */
function SearchBar({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <div className="relative mb-4 w-56">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search offers..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

/**
 * @function OfferGrid
 * @description Renders a grid of offer cards or loading skeletons.
 * @param {Object} props - The component props.
 * @param {OfferFormValues[]} props.offers - Array of offer data.
 * @param {boolean} props.isLoading - Indicates if offers are still loading.
 * @returns {JSX.Element} The rendered OfferGrid component.
 */
function OfferGrid({ offers, isLoading }: { offers?: OfferFormValues[]; isLoading: boolean }) {
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
          imageUrl={offer.files[0]?.url ?? ""}
        />
      ))}
    </div>
  );
}

/**
 * @function OffersPage
 * @description The main component for the Offers page.
 * It manages the state for search functionality and renders the page layout.
 * @returns {JSX.Element} The rendered OffersPage component.
 */
export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const offers = useQuery(api.offers.getAllOffersForUpdate) as OfferFormValues[];

  // Filter offers based on the search term
  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    return offers.filter((offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [offers, searchTerm]);

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <PageHeader />
      <div className="flex w-full flex-col rounded-lg bg-background p-2">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <OfferGrid offers={filteredOffers} isLoading={offers === undefined} />
      </div>
    </div>
  );
}
