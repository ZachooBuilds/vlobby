import { Badge } from '@tremor/react';
import { ParkingSpot } from '../_forms/parking-validation';
import { useQuery } from 'convex/react';
import useModalStore from '../../../lib/global-state/modal-state';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { ParkingSpotDetails } from '../../../lib/app-data/app-types';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { useState } from 'react';

interface ActiveParkSummaryProps {
  parkingSpot: ParkingSpot;
  onMoveVehicle: (parkingLogId: Id<'parkingLogs'>) => void;
}

const ActiveParkSummary = ({
  parkingSpot,
  onMoveVehicle,
}: ActiveParkSummaryProps) => {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleMoveVehicle = () => {
    if (parkInfo.activeParkingLog) {
      onMoveVehicle(parkInfo.activeParkingLog._id as Id<'parkingLogs'>);
    }
    closeModal();
  };

  const parkInfo = useQuery(api.parking.getParkingSpotById, {
    id: parkingSpot._id! as Id<'parkingSpots'>,
  }) as ParkingSpotDetails;

  if (!parkInfo) return null;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4 pt-4">
        <div className="flex flex-row items-center justify-between">
          <Badge>{parkInfo.parkingSpot.name}</Badge>
          <Button variant="outline" size="sm" onClick={handleMoveVehicle}>
            Move Vehicle
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <span className="font-medium">Status:</span>
            <span>{parkInfo.activeParkingLog ? 'Occupied' : 'Available'}</span>
          </div>
          {parkInfo.activeParkingLog && (
            <>
              <div className="flex flex-row justify-between">
                <span className="font-medium">Vehicle:</span>
                <span>{parkInfo.vehicle?.rego}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="font-medium">Make/Model:</span>
                <span>{`${parkInfo.vehicle?.make} ${parkInfo.vehicle?.model}`}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="font-medium">Color:</span>
                <span>{parkInfo.vehicle?.color}</span>
              </div>
              {parkInfo.space && (
                <div className="flex flex-row justify-between">
                  <span className="font-medium">Assigned Space:</span>
                  <span>{parkInfo.space.spaceName}</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveParkSummary;
