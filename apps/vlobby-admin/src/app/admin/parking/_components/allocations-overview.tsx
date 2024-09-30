"use client";

import { useState } from "react";
import { useQuery } from "convex/react";

import UpsertAllocationForm from "../_forms/upsert-allocation";

import {  Loader2 } from "lucide-react";
import { Allocation } from "../_forms/allocation-validation";
import AllocationSummaryCard from "./allocation-summary";
import { api } from "@repo/backend/convex/_generated/api";
import useModalStore from "../../../lib/global-state/modal-state";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import NoData from "../../_components/global-components/no-data";

interface AllocationOverviewProps {
  spaceId?: string;
}

const AllocationOverview = ({ spaceId }: AllocationOverviewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const allocations = useQuery(api.allocations.getAll);

  const openModal = useModalStore((state) => state.openModal);

  const handleAddAllocation = () => {
    openModal(
      "Add New Allocation",
      "Enter the details of the new allocation",
      <UpsertAllocationForm />,
    );
  };

  const filteredAllocations = allocations?.filter(
    (allocation: Allocation) =>
      allocation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  ) as Allocation[];

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
        <Button variant="secondary" onClick={handleAddAllocation}>
          Add Allocation
        </Button>
      </div>
      <div className="h-full w-full">
        {allocations === undefined ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAllocations.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <NoData
              badgeText="No Allocations"
              title="No allocations found"
              description="There are no allocations matching your search criteria. Try adjusting your search or add a new allocation."
              buttonText="Add Allocation"
              formComponent={<UpsertAllocationForm />}
              sheetTitle="Add New Allocation"
              sheetDescription="Enter the details of the new allocation"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredAllocations.map((allocation) => (
              <AllocationSummaryCard
                key={allocation._id}
                allocation={allocation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationOverview;
