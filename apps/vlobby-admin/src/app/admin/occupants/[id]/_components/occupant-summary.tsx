"use client";
import { Badge } from "@tremor/react";
import {
  Mail,
  Phone,
  Package,
  MessageCircle,
  FileText,
} from "lucide-react";
import { OccupantFormData } from "../../_form/occupant-upsert";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { OccupantsIconPath } from "../../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";


interface OccupantDetailsProps {
  occupant: OccupantFormData;
}

const OccupantDetails = ({ occupant }: OccupantDetailsProps) => {

  if (!occupant) {
    return <div className="text-center">No occupant details found.</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {OccupantsIconPath()}
          </svg>
          Occupant Details
        </CardTitle>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              {occupant.firstName.charAt(0).toUpperCase()}
              {occupant.lastName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-medium">
              {occupant.firstName} {occupant.lastName}
            </h2>
            <Badge>Settled</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="flex items-center gap-1 text-sm">
              <Mail className="h-4 w-4" />
              {occupant.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="flex items-center gap-1 text-sm">
              <Phone className="h-4 w-4" />
              {occupant.phoneNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Parcel Preference</p>
            <p className="flex items-center gap-1 text-sm">
              <Package className="h-4 w-4" />
              {occupant.parcelPreference}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Number of Spaces </p>
            <p className="flex items-center gap-1 text-sm">
              {occupant.occupantSpaces?.length ?? "0"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Occupant Notes</p>
          <p className="flex items-start gap-1 text-sm">
            <FileText className="h-4 w-4" />
            {occupant.notes}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupantDetails;
