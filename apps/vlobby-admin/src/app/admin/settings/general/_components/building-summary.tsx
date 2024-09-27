

import { Badge} from "@tremor/react";
import { Building, Layers3, PenIcon } from "lucide-react";
import UpsertSiteForm, { BuildingFormValues } from "../_forms/upsert-building";
import useModalStore from "../../../../lib/global-state/modal-state";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

type Props = {
  buildingDetails: BuildingFormValues;
};

export default function BuildingSummary({ buildingDetails }: Props) {
  const openModal = useModalStore((state) => state.openModal);
  // Handle the button click to open the sheet
  const handleButtonClick = () => {
    openModal(
      "Edit Building",
      "Use the form below to edit or update the building details",
      <UpsertSiteForm selectedBuildingDetails={buildingDetails} />,
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-start gap-2">
            <Building className="h-5 w-5 " />
            <CardTitle className="text-md font-medium">
              {buildingDetails?.name}
            </CardTitle>
          </div>
          <Button variant="outline" size="icon" onClick={handleButtonClick}>
            <PenIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {buildingDetails?.description}
        </p>
        <div className="flex flex-row items-center justify-start gap-2">
          <Layers3 className="h-4 w-4" />
          <p className="text-sm text-muted-foreground">
            {buildingDetails?.floors} Floors
          </p>
        </div>
        <p className="text-sm text-foreground">Special Floors:</p>
        <div className="flex flex-wrap gap-2">
          {buildingDetails?.namedFloors?.map((floor) => (
            <Badge key={floor.index} className="text-xs">
              {floor.name} ({floor.index})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
