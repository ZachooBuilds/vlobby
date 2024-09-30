import { useState } from "react";
import CarParkMap from "./parkingMapLoader";

interface ParkingSpotSelectorProps {
  onSpotSelect: (spotId: string | null) => void;
}

export function ParkingSpotSelector({
  onSpotSelect,
}: ParkingSpotSelectorProps) {
  const [isSelectingSpot, setIsSelectingSpot] = useState(false);

  return (
    <div>
      <button onClick={() => setIsSelectingSpot(!isSelectingSpot)}>
        {isSelectingSpot ? "Cancel Selection" : "Select Parking Spot"}
      </button>
      {isSelectingSpot && (
        <div className="bg-white-700 mx-auto my-5 h-[82vh] w-[98%]">
          <CarParkMap
            onSpotSelect={onSpotSelect}
            isSelecting={isSelectingSpot}
          />
        </div>
      )}
    </div>
  );
}
