'use client';
import React, { useState } from 'react';
import { api } from '@repo/backend/convex/_generated/api';
import { ActiveRequest, Vehicle } from '../../../lib/app-types';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Badge } from '@tremor/react';
import { CarIconPath } from '../../../../public/svg/icons';
import { useQuery } from 'convex/react';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../../lib/global-state';
import AddVehicleForm from '../_forms/add-vehicle';
import { RequestVehicleForm } from '../_forms/request-vehicle';
import { ActiveRequestCard } from './active-request';
import Link from 'next/link';
import VehicleLookup from '../_forms/vehicle-lookup';

export const VehicleCard = ({
  vehicle,
  onSelect,
}: {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}) => {
  return (
    <Card className="w-full cursor-pointer" onClick={() => onSelect(vehicle)}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">
              {vehicle.make} {vehicle.model}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-4 text-sm text-muted-foreground">
          <span>{vehicle.type}</span>
          <span>
            {vehicle.color} • {vehicle.year}
          </span>
        </div>
        <div className="flex flex-row gap-2 justify-start">
          <Badge color="indigo" size={'xs'}>
            {vehicle.rego}
          </Badge>
          <Badge size="xs" color={vehicle.isParked ? 'green' : 'gray'}>
            {vehicle.isParked ? 'Parked' : 'Not Parked'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export function VehicleOverview() {
  const vehicles = useQuery(api.vehicles.getAllForUser);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isManualAdd, setIsManualAdd] = useState(false);
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);

  const activeRequests = useQuery(api.requests.getActiveRequestsForVehicles, {
    vehicleIds: vehicles?.map((vehicle) => vehicle._id) ?? [],
  }) as ActiveRequest[];

  if (!vehicles) {
    return <div>Loading vehicles...</div>;
  }

  const handleSelectVehicle = (vehicle: Vehicle) => {
    if (vehicle.isParked) {
      openDrawer(
        'Vehicle Options',
        'Choose an action for this vehicle',
        <div className="flex flex-col gap-4">
          <Button onClick={() => handleRequestVehicle(vehicle)}>
            Request Vehicle
          </Button>
          <Button variant="outline" onClick={() => handleEditVehicle(vehicle)}>
            Edit Vehicle Details
          </Button>
        </div>
      );
    } else {
      handleEditVehicle(vehicle);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsAddingVehicle(false);
  };

  const handleRequestVehicle = (vehicle: Vehicle) => {
    openDrawer(
      'Request Vehicle',
      'Submit a request for this vehicle',
      <RequestVehicleForm vehicleId={vehicle._id} />
    );
  };

  const handleBack = () => {
    setSelectedVehicle(null);
    setIsAddingVehicle(false);
    setIsManualAdd(false); // Add this line to reset the manual add state
  };

  const renderContent = () => {
    if (isAddingVehicle || isManualAdd || selectedVehicle) {
      return renderForm();
    } else {
      return renderVehicleList();
    }
  };

  const renderVehicleList = () => (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="w-5 h-5 fill-foreground">
            <CarIconPath />
          </div>
          <h2 className="text-xl font-semibold">Your Vehicles</h2>
          <Badge size="sm" color="blue">
            {vehicles.length}
          </Badge>
        </div>
        <Link href="/vehicles/vehicle-lookup">
          <Button className="w-full">Add Vehicle</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
            onSelect={handleSelectVehicle}
          />
        ))}
      </div>
    </>
  );

  const renderForm = () => (
    <div className="flex flex-col w-full">
      <Button variant="secondary" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Vehicles
      </Button>
      <div className="w-full">
        <AddVehicleForm selectedVehicle={selectedVehicle || undefined} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {activeRequests && activeRequests.length > 0 && (
        <div className="mb-4 space-y-4">
          {activeRequests.map((request) => (
            <ActiveRequestCard key={request.vehicle.rego} request={request} />
          ))}
        </div>
      )}
      {renderContent()}
    </div>
  );
}
