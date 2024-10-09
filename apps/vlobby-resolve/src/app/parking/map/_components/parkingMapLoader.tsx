import dynamic from "next/dynamic";
import { useMemo } from "react";

interface CarParkMapProps {
  onSpotSelect?: (spotId: string | null) => void;
  isSelecting?: boolean;
}

export default function CarParkMap({ onSpotSelect, isSelecting }: CarParkMapProps) {
  const DynamicCarparkMap = useMemo(
    () =>
      dynamic(() => import("./dynamicCarparkMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  return (
    <>
      <div className="bg-white-700 mx-auto my-5 h-[82vh] w-[98%]">
        <DynamicCarparkMap onSpotSelect={onSpotSelect} isSelecting={isSelecting} />
      </div>
    </>
  );
}
