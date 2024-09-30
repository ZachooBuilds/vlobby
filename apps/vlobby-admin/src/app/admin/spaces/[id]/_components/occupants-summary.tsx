"use client";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import AddOccupantForm from "../../_forms/add-occupant-form";
import { Badge } from "@tremor/react";
import { useRouter } from "next/navigation";
import { api } from "@repo/backend/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { OccupantsIconPath } from "../../../../lib/icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { spaceRoleOptions } from "../../../../lib/app-data/static-data";

/**
 * @interface Occupant
 * @description Defines the structure of an occupant object
 */
export interface Occupant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  orgId: string;
  role?: string;
  parcelPreference: string;
  userId: string;
  avatarUrl?: string;
}

/**
 * @interface OccupantsListProps
 * @description Defines the props for the OccupantsList component
 */
interface OccupantsListProps {
  occupants: Occupant[];
  spaceId: string;
}

/**
 * @function OccupantsList
 * @description Renders a list of occupants for a specific space
 * @param {OccupantsListProps} props - The component props
 * @returns {JSX.Element} The rendered OccupantsList component
 */
const OccupantsList = ({ occupants, spaceId }: OccupantsListProps) => {
  const router = useRouter();

  // Fetch all occupants from the database
  const allOccupantsList = (useQuery(api.occupants.getAll) as Occupant[]) ?? [];

  // Filter out occupants that are already added to the space
  const occupantsWithoutAddedOccupants = allOccupantsList.filter(
    (occupant) =>
      !occupants.some((addedOccupant) => addedOccupant._id === occupant._id),
  );

  /**
   * @function handleOccupantClick
   * @description Handles the click event on an occupant
   * @param {Occupant} occupant - The clicked occupant
   */
  const handleOccupantClick = (occupant: Occupant) => {
    router.push(`/admin/occupants/${occupant._id}`);
  };

  return (
    <Card className="h-full p-0">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {OccupantsIconPath()}
          </svg>
          Occupants
        </CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size={'icon'}>
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-muted shadow-sm">
            <AddOccupantForm
              allOccupants={occupantsWithoutAddedOccupants}
              spaceId={spaceId}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-2 pt-0">
        {/* Loading state */}
        {occupants == undefined && (
          <div key={'loading-occupant'} className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
            <div className="flex-grow">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          </div>
        )}

        {/* Empty state */}
        {occupants && occupants.length === 0 && (
          <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
            ✋ No occupants added yet.
          </div>
        )}

        {occupants?.map((occupant) => (
          <div
            key={occupant._id}
            className="flex cursor-pointer flex-row items-center gap-4 rounded-md p-2 transition-colors hover:bg-muted"
            onClick={() => handleOccupantClick(occupant)}
          >
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-muted text-lg text-primary">
                {`${occupant.firstName[0]}${occupant.lastName[0]}`}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full flex-col items-start justify-start gap-2">
              <div className="text-sm font-medium">{`${occupant.firstName} ${occupant.lastName}`}</div>

              <div className="text-sm text-muted-foreground">
                {occupant.email}
              </div>
              <div className="text-sm text-muted-foreground">
                {occupant.phoneNumber}
              </div>
              <Badge size="xs">
                {
                  spaceRoleOptions.find((role) => role.id === occupant.role)
                    ?.name
                }
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OccupantsList;
