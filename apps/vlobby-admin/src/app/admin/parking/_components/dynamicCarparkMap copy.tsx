'use client';

/**
 * @file FloorPlanMap Component
 * @description This component provides an interactive floor plan map for parking management.
 * It uses react-leaflet for map rendering and Convex for data management.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  ImageOverlay,
  useMapEvents,
  CircleMarker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, PlusIcon } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';

import { LocationForm, LevelForm, ParkingSpotForm } from '../_forms/map-forms';

import { Level, ParkingSpot } from '../_forms/parking-validation';
import ActiveParkSummary from './active-park-summary';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { api } from '@repo/backend/convex/_generated/api';
import { ParkingLog, ValueLabelPair } from '../../../lib/app-data/app-types';
import useModalStore from '../../../lib/global-state/modal-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Button } from '@repo/ui/components/ui/button';
import { Switch } from '@repo/ui/components/ui/switch';
import { Badge } from '@repo/ui/components/ui/badge';
import { toast } from '@repo/ui/hooks/use-toast';

// Constants for the image and map bounds
const imageBounds: [L.LatLngTuple, L.LatLngTuple] = [
  [0, 0],
  [600, 900],
];

/**
 * @component LevelSelection
 * @description Component for level and location selection
 * @param {Object} props - Component props
 * @param {boolean} props.isEditing - Flag indicating if edit mode is active
 * @param {function} props.onEditToggle - Function to toggle edit mode
 * @param {function} props.onLevelChange - Function to handle level change
 */
function LevelSelection({
  isEditing,
  onEditToggle,
  onLevelChange,
}: {
  isEditing: boolean;
  onEditToggle: (checked: boolean) => void;
  onLevelChange: (levelId: Id<'parkingLevels'> | null) => void;
}) {
  const locations = useQuery(
    api.parking.getAllLocationsValueLabelPair
  ) as ValueLabelPair[];
  const [selectedLocationId, setSelectedLocationId] =
    useState<Id<'parkingLocations'> | null>(null);
  const [selectedLevelId, setSelectedLevelId] =
    useState<Id<'parkingLevels'> | null>(null);
  const levels = useQuery(
    api.parking.getAllParkingLevelsValueLabelPair,
    selectedLocationId ? { locationId: selectedLocationId } : 'skip'
  ) as ValueLabelPair[];

  const openModal = useModalStore((state) => state.openModal);

  // Set default location and level when data is loaded
  useEffect(() => {
    if (locations?.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locations[0]?.value as Id<'parkingLocations'>);
    }
    if (levels?.length > 0 && !selectedLevelId) {
      const firstLevel = levels[0];
      if (firstLevel) {
        setSelectedLevelId(firstLevel.value as Id<'parkingLevels'>);
        onLevelChange(firstLevel.value as Id<'parkingLevels'>);
      }
    }
  }, [locations, levels, selectedLocationId, selectedLevelId, onLevelChange]);

  return (
    <div className="flex flex-row items-center justify-end gap-2">
      {/* Location selection */}
      <div className="flex flex-row items-center gap-1">
        <Select
          value={selectedLocationId ?? undefined}
          onValueChange={(value) =>
            setSelectedLocationId(value as Id<'parkingLocations'>)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Location" />
          </SelectTrigger>
          <SelectContent>
            {locations?.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <LocationForm />
          </PopoverContent>
        </Popover>
      </div>

      {/* Level selection */}
      <div className="flex flex-row items-center gap-1">
        <Select
          value={selectedLevelId ?? undefined}
          onValueChange={(value) => {
            setSelectedLevelId(value as Id<'parkingLevels'>);
            onLevelChange(value as Id<'parkingLevels'>);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>
            {levels?.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            openModal(
              'Add New Level',
              'Enter details for the new level',
              <LevelForm />
            )
          }
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit mode toggle */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-sm text-muted-foreground">Edit</label>
        <Switch checked={isEditing} onCheckedChange={onEditToggle} />
      </div>
    </div>
  );
}

/**
 * @component ParkingSpots
 * @description Component for adding and managing parking spot markers on the map
 * @param {Object} props - Component props
 * @param {boolean} props.isEditing - Flag indicating if edit mode is active
 * @param {Id<"parkingLevels">} props.levelId - ID of the selected parking level
 */
function ParkingSpots({
  isEditing,
  levelId,
  isSelecting,
  onSpotSelect,
  activeParkingLogs,
}: {
  isEditing: boolean;
  levelId: Id<'parkingLevels'>;
  isSelecting: boolean;
  onSpotSelect?: (spotId: string | null) => void;
  activeParkingLogs: ParkingLog[];
}) {
  const openModal = useModalStore((state) => state.openModal);
  const upsertParkingSpotMutation = useMutation(api.parking.upsertParkingSpot);
  const parkingSpots =
    (useQuery(api.parking.getParkingSpotsByLevel, {
      levelId,
    }) as ParkingSpot[]) ?? [];
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.CircleMarker>>({});
  const closeModal = useModalStore((state) => state.closeModal);
  const [isMovingVehicle, setIsMovingVehicle] = useState(false);
  const [movingParkingLogId, setMovingParkingLogId] =
    useState<Id<'parkingLogs'> | null>(null);

  const isSpotOccupied = (spotId: string) => {
    return activeParkingLogs.some((log) => log.parkId === spotId);
  };

  const getMarkerColor = (spotId: string) => {
    if (spotId === selectedSpotId) return 'green';
    if (isSpotOccupied(spotId)) return 'red';
    return 'blue';
  };

  useEffect(() => {
    // Update marker colors when selectedSpotId or activeParkingLogs change
    Object.entries(markerRefs.current).forEach(([id, marker]) => {
      const color = getMarkerColor(id);
      marker.setStyle({ fillColor: color, color: color });
    });
  }, [selectedSpotId, activeParkingLogs]);

  const handleMarkerClick = (spot: ParkingSpot) => {
    const isOccupied = isSpotOccupied(spot._id!);

    if (isEditing) {
      // In edit mode, allow selection of any spot
      openModal(
        'Edit Point',
        'Update or delete the point',
        <ParkingSpotForm
          selectedSpot={spot}
          levelId={levelId}
          onSubmit={(values) =>
            handleUpsertMarker(values, L.latLng(spot.x, spot.y))
          }
        />
      );
    } else if (isSelecting && !isOccupied) {
      // Allow selection of unoccupied spots for both normal selection and moving
      const newSelectedId = spot._id === selectedSpotId ? null : spot._id!;
      setSelectedSpotId(newSelectedId);
      if (onSpotSelect) {
        onSpotSelect(newSelectedId);
      }
    } else if (!isSelecting && isOccupied) {
      openModal(
        'Parking Spot Details',
        `Viewing info for: ${spot.name}`,
        <ActiveParkSummary
          parkingSpot={spot}
          onMoveVehicle={(parkingLogId) => {
            closeModal();
            if (onSpotSelect) {
              onSpotSelect(null); // Deselect current spot
            }
            setIsMovingVehicle(true);
            setMovingParkingLogId(parkingLogId);
          }}
        />
      );
    }
  };

  // Handle map click events
  useMapEvents({
    click(e) {
      if (
        isEditing &&
        L.latLngBounds(imageBounds[0], imageBounds[1]).contains(e.latlng)
      ) {
        openModal(
          'Add New Point',
          'Enter a name for the new point',
          <ParkingSpotForm
            levelId={levelId}
            onSubmit={(values) => handleUpsertMarker(values, e.latlng)}
          />
        );
      }
    },
  });

  /**
   * @function handleUpsertMarker
   * @description Handles adding or updating a parking spot marker
   * @param {Object} values - Form values for the parking spot
   * @param {L.LatLng} position - Position of the marker on the map
   */
  const handleUpsertMarker = async (
    values: { name: string; _id?: string },
    position: L.LatLng
  ) => {
    try {
      await upsertParkingSpotMutation({
        _id: values._id as Id<'parkingSpots'>,
        name: values.name,
        levelId,
        x: position.lat,
        y: position.lng,
      });
    } catch (error) {
      console.error('Error saving parking spot:', error);
    }
  };

  return (
    <>
      {parkingSpots.map((spot) => (
        <CircleMarker
          key={spot._id}
          center={[spot.x, spot.y]}
          radius={9}
          fillColor={getMarkerColor(spot._id!)}
          color={getMarkerColor(spot._id!)}
          fillOpacity={0.5}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              handleMarkerClick(spot);
            },
          }}
          ref={(ref) => {
            if (ref) {
              markerRefs.current[spot._id!] = ref;
            }
          }}
        />
      ))}
    </>
  );
}

/**
 * @component FloorPlanMap
 * @description Main component for the floor plan map
 * @returns {JSX.Element} The rendered FloorPlanMap component
 */
interface CarParkMapProps {
  onSpotSelect?: (spotId: string | null) => void;
  isSelecting?: boolean;
}

export default function CarParkMap({
  onSpotSelect,
  isSelecting = false,
}: CarParkMapProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [selectedLevelId, setSelectedLevelId] =
    useState<Id<'parkingLevels'> | null>(null);

  const closeModal = useModalStore((state) => state.closeModal);

  const levelData = useQuery(
    api.parking.getParkingLevel,
    selectedLevelId ? { id: selectedLevelId } : 'skip'
  ) as Level;

  const activeParkingLogs = useQuery(
    api.requests.getActiveParkingLogs,
    {}
  ) as ParkingLog[];

  const [isMovingVehicle, setIsMovingVehicle] = useState(false);
  
  const [movingParkingLogId, setMovingParkingLogId] =
    useState<Id<'parkingLogs'> | null>(null);

  const moveParkingLogMutation = useMutation(api.requests.moveParkingLog);

  const handleMoveVehicle = useCallback(
    (parkingLogId: Id<'parkingLogs'>) => {
      console.log('handleMoveVehicle called with parkingLogId:', parkingLogId);
      setIsMovingVehicle(true);
      setMovingParkingLogId(parkingLogId);
      closeModal();
      console.log('isMovingVehicle set to true, movingParkingLogId set to:', parkingLogId);
    },
    [closeModal]
  );

  const handleSpotSelect = useCallback(
    (spotId: string | null) => {
      console.log('handleSpotSelect called with spotId:', spotId);
      console.log('Current state - isMovingVehicle:', isMovingVehicle, 'movingParkingLogId:', movingParkingLogId);
      if (isMovingVehicle && spotId && movingParkingLogId) {
        console.log('Attempting to move vehicle to new spot');
        // Use the moveParkingLog mutation instead of updateParkingLog
        moveParkingLogMutation({
          parkingLogId: movingParkingLogId,
          newParkId: spotId as Id<'parkingSpots'>,
        })
          .then(() => {
            console.log('Vehicle successfully moved to new spot');
            toast({
              title: 'Vehicle Moved',
              description:
                'The vehicle has been successfully moved to the new spot.',
            });
            setIsMovingVehicle(false);
            setMovingParkingLogId(null);
            console.log('isMovingVehicle and movingParkingLogId reset');
          })
          .catch((error) => {
            console.error('Error moving vehicle:', error);
            toast({
              title: 'Error',
              description: 'Failed to move the vehicle. Please try again.',
              variant: 'destructive',
            });
          });
      } else if (onSpotSelect) {
        console.log('Calling onSpotSelect with spotId:', spotId);
        onSpotSelect(spotId);
      }
    },
    [isMovingVehicle, movingParkingLogId, moveParkingLogMutation, onSpotSelect]
  );

  // Apply custom styles to Leaflet container and tiles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        background-color: hsl(var(--background)) !important;
      }
      .leaflet-tile {
        filter: opacity(0.5) !important;
      }
    `;
    document.head.append(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div className="flex h-full flex-col">
      {/* Level selection and edit toggle */}
      <div className="z-10 p-2">
        <LevelSelection
          isEditing={isEditing}
          onEditToggle={(checked) => {
            setIsEditing(checked);
            closeModal();
          }}
          onLevelChange={setSelectedLevelId}
        />
      </div>

      {/* Map container */}
      <div className="relative z-0 flex-grow">
        {selectedLevelId && levelData === undefined ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedLevelId && levelData ? (
          <MapContainer
            center={[250, 250]}
            zoom={0}
            className="absolute inset-0 h-full w-full"
            crs={L.CRS.Simple}
            minZoom={-2}
            maxZoom={5}
            zoomControl={false}
            dragging={true}
            attributionControl={false}
            zoomSnap={0.5}
            zoomDelta={0.5}
          >
            <ImageOverlay
              url={levelData.image?.[0]?.url ?? ''}
              bounds={imageBounds}
            />
            <ParkingSpots
              isEditing={isEditing}
              levelId={selectedLevelId}
              isSelecting={isSelecting || isMovingVehicle}
              onSpotSelect={handleSpotSelect}
              activeParkingLogs={activeParkingLogs}
            />
          </MapContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-muted-foreground">
              Please select a location and level to view the parking map.
            </p>
          </div>
        )}
      </div>

      {isMovingVehicle && (
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="secondary">Moving Vehicle</Badge>
        </div>
      )}
    </div>
  );
}
