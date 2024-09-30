'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import AddVehicleForm from '../_forms/add-vehicle';
import { Loader2 } from 'lucide-react';
import { Vehicle } from '../_forms/add-vehicle-validation';
import VehicleSummaryCard from './vehicle-summary';
import { api } from '@repo/backend/convex/_generated/api';
import useSheetStore from '../../../lib/global-state/sheet-state';
import { VehicleInfo } from '../../../lib/app-data/app-types';
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';
import NoData from '../../_components/global-components/no-data';

interface VehicleOverviewProps {
  spaceId?: string;
}

const VehicleOverview = ({ spaceId }: VehicleOverviewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const vehicles = useQuery(api.vehicles.getAll);

  const openSheet = useSheetStore((state) => state.openSheet);

  const handleAddVehicle = () => {
    openSheet(
      'Add New Vehicle',
      'Enter the details of the new vehicle',
      <AddVehicleForm />
    );
  };

  const filteredVehicles =
    (vehicles?.filter(
      (vehicle: VehicleInfo) =>
        vehicle.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase())
    ) as Vehicle[]) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Input
          type="text"
          placeholder="Search by rego or model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[40%] rounded-lg border"
        />
        <Button variant="secondary" onClick={handleAddVehicle}>
          Add Vehicle
        </Button>
      </div>
      <div className="h-full w-full">
        {vehicles === undefined ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <NoData
              badgeText="No Vehicles"
              title="No vehicles found"
              description="There are no vehicles matching your search criteria. Try adjusting your search or add a new vehicle."
              buttonText="Add Vehicle"
              formComponent={<AddVehicleForm />}
              sheetTitle="Add New Vehicle"
              sheetDescription="Enter the details of the new vehicle"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleSummaryCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleOverview;
