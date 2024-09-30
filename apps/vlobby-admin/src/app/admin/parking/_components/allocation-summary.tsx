
import { Badge } from "@tremor/react";
import { PencilIcon } from "lucide-react";
import { Allocation } from "../_forms/allocation-validation";
import UpsertAllocationForm from "../_forms/upsert-allocation";
import useModalStore from "../../../lib/global-state/modal-state";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

interface AllocationSummaryCardProps {
  allocation: Allocation;
}

const AllocationSummaryCard = ({ allocation }: AllocationSummaryCardProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleEditAllocation = () => {
    openModal(
      "Edit Allocation",
      "Update the details of the allocation",
      <UpsertAllocationForm selectedAllocation={allocation} />,
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-row justify-between pt-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <Badge>{allocation.name}</Badge>
          <div>
            <p className="font-medium">
              Allocated Parks: {allocation.allocatedParks}
            </p>
            <p className="text-sm text-muted-foreground">
              {allocation.description}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleEditAllocation}>
          <PencilIcon className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AllocationSummaryCard;
