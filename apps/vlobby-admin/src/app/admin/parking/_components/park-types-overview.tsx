"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import UpsertParkTypeForm from "../_forms/upsert-park-type";
import { Badge } from "@tremor/react";
import { PencilIcon, Loader2 } from "lucide-react";
import { ParkType } from "../_forms/park-type-validation";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { api } from "@repo/backend/convex/_generated/api";
import useModalStore from "../../../lib/global-state/modal-state";
import { Input } from "@repo/ui/components/ui/input";
import NoData from "../../_components/global-components/no-data";

interface ParkTypeOverviewProps {
  spaceId?: string;
}

const ParkTypeSummaryCard = ({
  parkType,
  onEdit,
}: {
  parkType: ParkType;
  onEdit: (parkType: ParkType) => void;
}) => (
  <Card className="w-full" key={parkType._id}>
    <CardContent className="flex flex-row justify-between pt-4">
      <div className="flex flex-col items-start justify-start gap-2">
        <Badge>{parkType.name}</Badge>
        <div>
          <p className="font-medium">
            Pricing Conditions: {parkType.pricingConditions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {parkType.description}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onEdit(parkType)}>
        <PencilIcon className="h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

const ParkTypeOverview = ({ spaceId }: ParkTypeOverviewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const parkTypes = useQuery(api.parkTypes.getAll);

  const openModal = useModalStore((state) => state.openModal);

  const handleAddParkType = () => {
    openModal(
      "Add New Park Type",
      "Enter the details of the new park type",
      <UpsertParkTypeForm />,
    );
  };

  const handleEditParkType = (parkType: ParkType) => {
    openModal(
      "Edit Park Type",
      "Update the details of the park type",
      <UpsertParkTypeForm selectedParkType={parkType} />,
    );
  };

  const filteredParkTypes =
    parkTypes?.filter(
      (parkType: ParkType) =>
        parkType.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
        parkType.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) as ParkType[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Input
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[40%] rounded-lg border"
        />
        <Button variant="secondary" onClick={handleAddParkType}>
          Add Park Type
        </Button>
      </div>
      <div className="h-full w-full">
        {parkTypes === undefined ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredParkTypes.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <NoData
              badgeText="No Park Types"
              title="No park types found"
              description="There are no park types matching your search criteria. Try adjusting your search or add a new park type."
              buttonText="Add Park Type"
              formComponent={<UpsertParkTypeForm />}
              sheetTitle="Add New Park Type"
              sheetDescription="Enter the details of the new park type"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredParkTypes.map((parkType) => (
              <ParkTypeSummaryCard
                key={parkType._id}
                parkType={parkType}
                onEdit={handleEditParkType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkTypeOverview;
