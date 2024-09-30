
import { Badge } from "@tremor/react";
import { PencilIcon } from "lucide-react";
import { Vehicle } from "../_forms/add-vehicle-validation";
import AddVehicleForm from "../_forms/add-vehicle";
import useModalStore from "../../../lib/global-state/modal-state";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

interface VehicleSummaryCardProps {
  vehicle: Vehicle;
}

const VehicleSummaryCard = ({ vehicle }: VehicleSummaryCardProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleEditVehicle = () => {
    openModal(
      "Edit Vehicle",
      "Update the details of the vehicle",
      <AddVehicleForm selectedVehicle={vehicle} />,
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-row justify-between pt-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <Badge>{vehicle.rego}</Badge>
          <div>
            <p className="font-medium">
              {vehicle.make} {vehicle.model}
            </p>
            <p className="text-sm text-muted-foreground">{vehicle.color}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleEditVehicle}>
          <PencilIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleSummaryCard;
