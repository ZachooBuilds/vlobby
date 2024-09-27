"use client";
import { Building } from "lucide-react";
import { FacilityFormData } from "../../_forms/facility-validation";
import { Badge } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { FacilityIconPath } from "../../../../lib/icons/icons";
import ImageGalleryComponent from "../../../_components/global-components/image-gallery";

interface FacilitiesOverviewProps {
  facility: FacilityFormData & { buildingName: string; facilityTypeName: string };
}

const FacilitiesOverview = ({ facility }: FacilitiesOverviewProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {FacilityIconPath()}
          </svg>
          {facility.name} Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <Badge size={"xs"}>{facility.name}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Availability</p>
            <Badge size={"xs"} color={facility.isPublic ? "green" : "red"}>
              {facility.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Audience Restrictions
            </p>
            <Badge
              size={"xs"}
              color={
                facility.audience && facility.audience.length > 0
                  ? "red"
                  : "green"
              }
            >
              {facility.audience && facility.audience.length > 0
                ? "Restricted"
                : "No Restrictions"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-sm">{facility.floor}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Building</p>
            <p className="flex items-center gap-1 text-sm">
              <Building className="h-4 w-4" />
              {facility.buildingName}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="text-sm">{facility.description}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Images</p>
          <ImageGalleryComponent
            images={facility.files.map((file) => file.url)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilitiesOverview;
