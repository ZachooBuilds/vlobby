'use client';

/**
 * @file DynamicCarParkMap Component
 * @description This component provides an interactive car park map for parking management.
 * It uses react-leaflet for map rendering and Convex for data management.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  ImageOverlay,
  useMapEvents,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, PlusIcon } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { api } from '@repo/backend/convex/_generated/api';
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
import {
  Level,
  ParkingLog,
  ParkingSpot,
  ValueLabelPair,
} from '../../../../lib/app-types';
import useDrawerStore from '../../../../lib/global-state';
import ActiveParkSummary from './active-park-summary';

// Constants for the image and map bounds
const imageBounds: [L.LatLngTuple, L.LatLngTuple] = [
  [0, 0],
  [600, 900],
];

/**
 * @component LevelSelection
 * @description Component for level and location selection
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

  const openModal = useDrawerStore((state) => state.openDrawer);

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
    <div className="flex flex-col gap-4 w-full">
      {/* Location selection */}
      <div className="w-full">
        <Select
          value={selectedLocationId ?? undefined}
          onValueChange={(value) =>
            setSelectedLocationId(value as Id<'parkingLocations'>)
          }
        >
          <SelectTrigger className="w-full">
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
      </div>

      {/* Level selection */}
      <div className="w-full">
        <Select
          value={selectedLevelId ?? undefined}
          onValueChange={(value) => {
            setSelectedLevelId(value as Id<'parkingLevels'>);
            onLevelChange(value as Id<'parkingLevels'>);
          }}
        >
          <SelectTrigger className="w-full">
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
      </div>
    </div>
  );
}

/**
 * @component ParkingSpots
 * @description Component for adding and managing parking spot markers on the map
 */
function ParkingSpots({
  isEditing,
  isSelecting,
  selectedSpotId,
  levelId,
  isMoving,
  onSpotSelect,
  activeParkingLogs,
}: {
  isEditing: boolean;
  isMoving: boolean;
  levelId: Id<'parkingLevels'>;
  onSpotSelect: (spot: ParkingSpot) => void;
  activeParkingLogs: ParkingLog[];
  selectedSpotId: string | null;
  isSelecting: boolean;
}) {
  const openModal = useDrawerStore((state) => state.openDrawer);
  const upsertParkingSpotMutation = useMutation(api.parking.upsertParkingSpot);
  const parkingSpots =
    (useQuery(api.parking.getParkingSpotsByLevel, {
      levelId,
    }) as ParkingSpot[]) ?? [];
  // const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.CircleMarker>>({});

  const isSpotOccupied = (spotId: string) =>
    activeParkingLogs.some((log) => log.parkId === spotId);

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

  return (
    <>
      {isMoving && (
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="secondary">Moving Vehicle</Badge>
        </div>
      )}
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
              onSpotSelect(spot);
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
 * @component CarParkMap
 * @description Main component for the car park map
 */
interface CarParkMapProps {
  onSpotSelect?: (spotId: string | null) => void;
  isSelecting?: boolean;
  selectedVehicleId?: string | null;
}

export default function CarParkMap({
  onSpotSelect,
  isSelecting = false,
  selectedVehicleId = null,
}: CarParkMapProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevelId, setSelectedLevelId] =
    useState<Id<'parkingLevels'> | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Id<'parkingLogs'> | null>(
    null
  );
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const updateParkingLog = useMutation(api.requests.moveParkingLog);

  const closeModal = useDrawerStore((state) => state.closeDrawer);
  const openModal = useDrawerStore((state) => state.openDrawer);

  const upsertParkingSpotMutation = useMutation(api.parking.upsertParkingSpot);

  const levelData = useQuery(
    api.parking.getParkingLevel,
    selectedLevelId ? { id: selectedLevelId } : 'skip'
  ) as Level;

  const activeParkingLogs = useQuery(
    api.requests.getActiveParkingLogs,
    {}
  ) as ParkingLog[];

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

  const handleUpsertMarker = async (
    values: { name: string; _id?: string },
    position: L.LatLng
  ) => {
    try {
      await upsertParkingSpotMutation({
        _id: values._id as Id<'parkingSpots'>,
        name: values.name,
        levelId: selectedLevelId! as Id<'parkingLevels'>,
        x: position.lat,
        y: position.lng,
      });
    } catch (error) {
      console.error('Error saving parking spot:', error);
    }
  };

  const isSpotOccupied = (spotId: string) =>
    activeParkingLogs.some((log) => log.parkId === spotId);

  const handleSpotSelect = (spot: ParkingSpot) => {
    // If we are in selecting mode and the spot is not occupied
    if (isSelecting && !isSpotOccupied(spot._id!)) {
      onSpotSelect!(spot._id!);
      // Add this line to update the selected spot visually
      setSelectedSpotId(spot._id!);
    }

    // Else if we are in moving mode and need to select new slot
    else if (isMoving && !isSpotOccupied(spot._id!)) {
      const newSelectedId = spot._id;
      updateParkingLog({
        parkingLogId: selectedLog!,
        newParkId: newSelectedId as Id<'parkingSpots'>,
      });
      setIsMoving(false);
      setSelectedLog(null);
    }

    // Else if we are not in edit mode and we select and active park show the vehicle details
    else if (!isSelecting && isSpotOccupied(spot._id!)) {
      openModal(
        'Parking Spot Details',
        `Viewing info for: ${spot.name}`,
        <ActiveParkSummary
          parkingSpot={spot}
          onMoveVehicle={(parkingLogId) => {
            setIsMoving(true);
            setSelectedLog(parkingLogId);
          }}
        />
      );
    }
  };



  // New useEffect to handle selectedVehicleId
  useEffect(() => {
    if (selectedVehicleId && activeParkingLogs?.length > 0) {
      const activeLog = activeParkingLogs.find(
        (log) => log.vehicleId === selectedVehicleId
      );
      if (activeLog) {
        setSelectedSpotId(activeLog.parkId);
      }
    }
  }, [selectedVehicleId, activeParkingLogs]);

  return (
    <div className="flex h-full flex-col">
      {/* Level selection and edit toggle */}
      <div className="z-5 p-2">
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
              selectedSpotId={selectedSpotId}
              isSelecting={isSelecting}
              isEditing={isEditing}
              isMoving={isMoving}
              levelId={selectedLevelId}
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
    </div>
  );
}
