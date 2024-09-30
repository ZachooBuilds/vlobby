"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Badge } from "@tremor/react";

interface VehicleInfo {
  rego: string;
  make: string;
  model: string;
  color: string;
  last_activity: string;
  isParked: boolean;
}

interface VehicleOverviewProps {
  spaceId: string;
}

const VehicleOverview = ({ spaceId }: VehicleOverviewProps) => {
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);

  useEffect(() => {
    // TODO: Fetch actual vehicle data using spaceId
    // This is placeholder data
    const placeholderVehicles: VehicleInfo[] = [
      {
        rego: "ABC123",
        make: "Toyota",
        model: "Camry",
        color: "Blue",
        last_activity: "2023-11-01",
        isParked: true,
      },
      {
        rego: "XYZ789",
        make: "Honda",
        model: "Civic",
        color: "Red",
        last_activity: "2023-10-30",
        isParked: false,
      },
      {
        rego: "DEF456",
        make: "Ford",
        model: "Mustang",
        color: "Black",
        last_activity: "2023-11-02",
        isParked: true,
      },
    ];
    setVehicles(placeholderVehicles);
  }, [spaceId]);

  return (
    <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2">
      {vehicles.map((vehicle, index) => (
        <Card className="w-full" key={index}>
          <CardContent className="flex flex-row gap-4 pt-4">
            <div className="w-30 flex h-full flex-col rounded-md bg-muted">
              <Image
                src="https://utfs.io/f/d6383b2c-59a3-48bc-9fd9-b93585cdae58-3ngb7z.com-land-roverland-roverfour-wheel-drive-vehiclesjaguar-land-roverland-rover-vehicles-1701527509330tb8px.png"
                alt={`${vehicle.make} ${vehicle.model}`}
                width={100}
                height={100}
                className="rounded-md object-contain p-2"
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <Badge>{vehicle.rego}</Badge>
              <div>
                <p className="font-medium">
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">{vehicle.color}</p>
                <p className="text-xs text-muted-foreground">
                  Last activity: {vehicle.last_activity}
                </p>
              </div>
              <Badge color={vehicle.isParked ? "green" : "blue"}>
                {vehicle.isParked ? "Parked" : "Not Parked"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleOverview;
