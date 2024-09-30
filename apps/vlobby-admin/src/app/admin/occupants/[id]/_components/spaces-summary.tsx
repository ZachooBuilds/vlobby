'use client';
import { Plus, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import AddSpaceToOccupantForm from '../../_form/add-space-to-occupant';
import { api } from '@repo/backend/convex/_generated/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { SpacesIconPath } from '../../../../lib/icons/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@tremor/react';
import { spaceRoleOptions } from '../../../../lib/app-data/static-data';

/**
 * @interface SpaceSummary
 * @description Defines the structure of a space summary object
 */
export interface SpaceSummary {
  _id: string;
  floor: string;
  buildingName: string;
  spaceName: string;
  role: string;
}

/**
 * @interface SpacesSummaryProps
 * @description Defines the props for the SpacesSummary component
 */
interface SpacesSummaryProps {
  spaces: SpaceSummary[];
  userId: string;
}

/**
 * @function SpacesSummary
 * @description Renders a summary of spaces for an occupant
 * @param {SpacesSummaryProps} props - The component props
 * @returns {JSX.Element} The rendered SpacesSummary component
 */
const SpacesSummary = ({ spaces, userId }: SpacesSummaryProps) => {
  const router = useRouter();

  // Fetch all occupants from the database
  const allSpacesList =
    (useQuery(api.spaces.getAllSpacesWithBuilding) as SpaceSummary[]) ?? [];

  // Filter out occupants that are already added to the space
  const spacesWithoutAddedSpaces = allSpacesList.filter(
    (space) => !spaces.some((addedSpace) => addedSpace._id === space._id)
  );

  /**
   * @function handleSpaceClick
   * @description Handles the click event on a space
   * @param {SpaceSummary} space - The clicked space
   */
  const handleSpaceClick = (space: SpaceSummary) => {
    router.push(`/admin/spaces/${space._id}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-medium">
          <svg
            className="h-5 w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            {SpacesIconPath()}
          </svg>
          Spaces Summary
        </CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size={'icon'}>
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-muted shadow-sm">
            <AddSpaceToOccupantForm
              allSpaces={spacesWithoutAddedSpaces}
              userId={userId}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-2 pt-0">
        {/* Loading state */}
        {spaces == undefined && (
          <div key={'loading-spaces'} className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
            <div className="flex-grow">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        )}

        {/* Empty state */}
        {spaces && spaces.length === 0 && (
          <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
            ✋ Not a member of any spaces yet.
          </div>
        )}

        {/* Spaces list */}
        {spaces?.map((space) => (
          <div
            key={space._id}
            className="flex cursor-pointer flex-col gap-1 rounded-md p-4 transition-colors hover:bg-muted"
            onClick={() => handleSpaceClick(space)}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{space.spaceName}</div>
              <Badge size="xs">
                {spaceRoleOptions.find((role) => role.id === space.role)?.name}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="mr-1 h-4 w-4" />
              {space.buildingName} - Floor {space.floor}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SpacesSummary;
