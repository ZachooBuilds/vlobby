/**
 * @file SpaceDetails Component
 * @description Displays detailed information about a specific space
 */

import { Building, Waves, Zap, ParkingCircle } from "lucide-react";
import { SpacesTableEntry } from "../../_table/spaces-table";
import { Badge } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { SpacesIconPath } from "../../../../lib/icons/icons";
import ImageGalleryComponent from "../../../_components/global-components/image-gallery";

/**
 * Props for the SpaceDetails component
 */
interface SpaceDetailsProps {
  space: SpacesTableEntry;
  images?: string[];
}

/**
 * SpaceDetails component for displaying comprehensive information about a space
 * @param {SpaceDetailsProps} props - The component props
 * @returns {JSX.Element} The rendered SpaceDetails component
 */
const SpaceDetails = ({ space, images }: SpaceDetailsProps) => {
  // Determine if the space is settled based on the settlement date
  const isSettled = new Date(space.settlementDate) < new Date();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {SpacesIconPath()}
          </svg>
          Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid layout for space details */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* Status */}
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge color={isSettled ? "green" : "red"} size="xs">
              {isSettled ? "Settled" : "Unsettled"}
            </Badge>
          </div>
          {/* Type */}
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <Badge size="xs">{space.type}</Badge>
          </div>
          {/* Floor */}
          <div>
            <p className="text-sm text-muted-foreground">Floor</p>
            <p className="text-sm">{space.floor}</p>
          </div>
          {/* Building */}
          <div>
            <p className="text-sm text-muted-foreground">Building</p>
            <p className="flex items-center gap-1 text-sm">
              <Building className="h-4 w-4" />
              {space.building}
            </p>
          </div>
          {/* Parks (Placeholder) */}
          <div>
            <p className="text-sm text-muted-foreground">Parks</p>
            <p className="flex items-center gap-1 text-sm">
              <ParkingCircle className="h-4 w-4" />
              {"2"}
            </p>
          </div>
          {/* Power Meter */}
          <div>
            <p className="text-sm text-muted-foreground">Power Meter</p>
            <p className="flex items-center gap-1 text-sm">
              <Zap className="h-4 w-4" />
              {space.powerMeterNumber}
            </p>
          </div>
          {/* Water Meter */}
          <div>
            <p className="text-sm text-muted-foreground">Water Meter</p>
            <p className="flex items-center gap-1 text-sm">
              <Waves className="h-4 w-4" />
              {space.waterMeterNumber}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="text-sm">{space.description}</p>
        </div>

        {/* Image Gallery */}
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Images</p>
          <ImageGalleryComponent images={images} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpaceDetails;
