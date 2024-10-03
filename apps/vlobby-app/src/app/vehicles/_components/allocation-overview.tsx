'use client';
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Badge } from '@tremor/react';
import { ParkIconPath } from '../../../../public/svg/icons';
import { Loader2} from 'lucide-react';
import useDrawerStore from '../../../lib/global-state';
import { Allocation } from '../../../lib/app-types';
import NoData from '../../_components/no-data';

const AllocationSummaryCard = ({ allocation }: { allocation: Allocation }) => {
  const { openDrawer } = useDrawerStore();

  const handleEditAllocation = () => {
    openDrawer(
      'Edit Allocation',
      'Update the details of the allocation',
      <div>{/* Add your edit allocation form here */}</div>
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
          <Badge size="xs" color="green">
            {allocation.occupiedParks} Occupied
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export function AllocationOverview() {
  const allocations = useQuery(
    api.allocations.getAllForCurrentUser
  ) as Allocation[];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="w-5 h-5 fill-foreground">
            <ParkIconPath />
          </div>
          <h2 className="text-xl font-semibold">Parking Allocations</h2>
          <Badge size="sm" color="blue">
            {allocations?.length}
          </Badge>
        </div>
      </div>
      {allocations === undefined ? (
        <div className="flex h-full w-full items-center justify-center pt-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : allocations?.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center pt-10">
          <NoData
            badgeText="No Allocations"
            title="No allocations found"
            description="There are no allocations matching your search criteria. Try adjusting your search or add a new allocation."
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
          {allocations?.map((allocation) => (
            <AllocationSummaryCard
              key={allocation._id}
              allocation={allocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
