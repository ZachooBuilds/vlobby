import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface CarParkMapProps {
  onSpotSelect?: (spotId: string | null) => void;
  isSelecting?: boolean;
  vehicleId?: string;
}

export default function CarParkMap({
  onSpotSelect,
  isSelecting,
  vehicleId,
}: CarParkMapProps) {
  const DynamicCarparkMap = useMemo(
    () =>
      dynamic(() => import('./dynamicCarparkMap'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <>
      <div className="bg-white-700 mx-auto my-5 h-[82vh] w-[98%]">
        <DynamicCarparkMap
          onSpotSelect={onSpotSelect}
          isSelecting={isSelecting}
          selectedVehicleId={vehicleId}
        />
      </div>
    </>
  );
}
