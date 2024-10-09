"use client"
import { Id } from '@repo/backend/convex/_generated/dataModel';

export type ImageUrlAndId = {
  url: string;
  storageId: Id<'_storage'>;
};

export type RequestCardData = {
  _id: string;
  requestType: string;
  status: string;
  vehicleDetails: string;
  parkName: string;
  assignedToName: string;
  assignedAt: string;
  serviceTime: string;
  createdAt: string;
};

export type VehicleRegistrationData = {
  plate: string;
  year_of_manufacture: string;
  make: string;
  model: string;
  submodel: string;
  vin: string;
  reported_stolen: 'Y' | 'N';
  plate2?: string | null;
  replacement_plate?: string;
  chassis?: string;
  engine_no?: string;
  cc_rating?: string;
  main_colour?: string;
  second_colour?: string;
  body_style?: string;
  vehicle_type?: string;
  country_of_origin?: string;
  tare_weight?: string;
  date_of_first_registration_in_nz?: string;
  no_of_seats?: string;
  fuel_type?: string;
  alternative_fuel_type?: string;
  previous_country_of_registration?: string;
  result_of_latest_wof_inspection?: string;
  expiry_date_of_last_successful_wof?: number;
  latest_odometer_reading?: string;
  licence_type?: string;
  licence_expiry_date?: string;
  transmission?: string;
  number_of_owners_no_traders?: string;
  power?: string;
  class?: string;
  industry_class?: string;
  industry_model_code?: string;
  mvma_model_code?: string;
  road_transport_code?: string;
  transmission_type?: string;
  plates?: {
    plate_status: string;
    plate_type: string;
    registration_plate: string;
    effective_date: string;
  }[];
  vehicle_usage?: string;
  number_of_owners?: string;
  safety_economy?: {
    electric_range?: number;
    electric_consumption?: number;
    fuel_stars?: number;
    fuel_consumption?: number;
    co2_stars?: number;
    co2?: number;
    yearly_co2?: number;
    driver_safety_stars?: number;
    driver_safety_test?: string;
    pollutants_stars?: number;
    test_regime?: string;
    safety_promo_badge?: string;
    ruc_rate?: number;
    ruc?: number;
    others_safety_test?: string;
    others_safety_stars?: number;
    warning_severity?: string;
    warning_message?: string;
    warning_action?: string;
    warning_details?: null | string;
  };
};

// New type definition
export type Building = {
  _id?: string;
  name: string;
  floors?: number;
  namedFloors?: Array<{
    index: number;
    name: string;
  }>;
  description?: string;
};

export type Level = {
  _id: Id<'levels'>;
  name: string;
  locationId: Id<'locations'>;
  image: Array<{
    url: string;
    storageId: string;
  }>;
};

export type ParkingSpot = {
  _id: Id<'parkingSpots'>;
  name: string;
  levelId: Id<'levels'>;
  x: number;
  y: number;
};

export type ParkingSpotDetails = {
  parkingSpot: {
    _id: string;
    _creationTime: number;
    name: string;
    levelId: string;
    x: number;
    y: number;
    orgId: string;
  };
  activeParkingLog: {
    _id: string;
    _creationTime: number;
    parkId: string;
    vehicleId: string;
    status: 'active';
    startTime: number;
    endTime?: number;
    orgId: string;
  } | null;
  vehicle: {
    _id: string;
    _creationTime: number;
    rego: string;
    make: string;
    model: string;
    color: string;
    spaceId?: string;
    orgId: string;
  } | null;
  space: {
    _id: string;
    _creationTime: number;
    spaceName: string;
    orgId: string;
  } | null;
};

export type ParkType = {
  _id: string;
  name: string;
  description: string;
  pricingConditions: PricingCondition[];
}

export type PricingCondition = {
  _id: string;
  startMinutes: number;
  endMinutes: number | null;
  interval: number;
  rate: number;
  isFinalCondition: boolean;
}

export type AllocationDetails = Allocation & {
  parkTypeName: string;
};


export type ParkingLog = {
  _id: string;
  requestId: string;
  vehicleId: string;
  parkId: string;
  parkTypeId: string;
  allocationId: string;
  sessionStart: string;
  sessionEnd?: string;
  status: 'active' | 'completed';
  orgId: string;
};

export type Space = {
  _id: Id<'spaces'>;
  spaceName: string;
  type: string;
  role: string;
  buildingName: string;
  powerMeterNumber: string;
  waterMeterNumber: string;
  accessibilityEnabled: boolean;
  titleNumber: string;
  building: string;
  floor: string;
  typeName: string;
  totalUsersCount?: number;
};

export type SpacesOverviewProps = {
  spaces: Space[];
};

export type Issue = {
  _id?: string;
  locationId?: string;
  spaceId?: string;
  facilityId?: string;
  floor?: string;
  buildingId?: string;
  priority: string;
  issueType: string;
  assignedToId?: string;
  title: string;
  status?: string;
  _creationTime: string;
  description: string;
  tags: Array<{
    value: string;
    label: string;
  }>;
  followUpDate?: Date;
  files?: Array<{
    url: string;
    storageId: string;
  }>;
};

export type WorkOrderDetails = {
  _id: string;
  _creationTime: string;
  workOrderType: string;
  tags: Array<{ value: string; label: string }>;
  title: string;
  priority: string;
  assignedContractor: {
    name: string;
    businessName: string;
    email: string;
  } | null;
  description: string;
  images: string[];
  status: string;
};

export type FacilityOverview = {
  _id?: string;
  name: string;
  description: string;
  facilityTypeId: string;
  buildingId: string;
  floor: string;
  isPublic: boolean;
  files: Array<{
    url: string;
    storageId: string;
  }>;
};

export type BookingDetails = {
  _id: Id<'bookings'>;
  _creationTime: number;
  orgId: string;
  facilityId: Id<'facilities'>;
  bookingTypeId: Id<'bookingTypes'>;
  userId: Id<'users'>;
  date: string;
  slots: Array<{
    slotIndex: number;
    slotTime: string;
  }>;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  facilityName: string;
  bookingTypeName: string;
  userName: string;
};

/**
 * @interface FileUploadWithPreviewProps
 * @description Defines the props for the FileUploadWithPreview component
 */
export type FileUploadWithPreviewProps = {
  name: string;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
}

/**
 * @interface FileData
 * @description Defines the structure of file data
 */
export type FileData = {
  url: string;
  storageId: Id<"_storage">;
  name?: string;
  type?: string; // Add this line
}

export type EventDetails = {
  _id: Id<'events'>;
  _creationTime: number;
  attendeeCount?: number;
  isAttending?: boolean;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  capacity: number;
  audience?: Array<{ type: string; entity: string }>;
  files?: string[];
  isPublicPlace: boolean;
  address?: string;
  spaceId?: string;
  orgId: string;
  facilityName: string;
};

export type ChatSummary = {
  _id: string;
  occupantId: string;
  occupantName: string;
  lastMessage: string;
  lastMessageDate: Date;
};

export type Message = {
  chatId: string;
  content: string;
  createdAt: string;
  isFromOccupant: boolean;
};

export type BookingType = {
  _id?: string;
  name: string;
  status: 'status:active' | 'status:inactive';
  startTime: Date;
  endTime: Date;
  interval: number;
  maxSlots: number;
  facilityId?: string;
  description: string;
  avalibleDays: Array<{
    value: string;
    label: string;
  }>;
  exceptionDates: Array<{
    date: Date;
    reason: string;
  }>;
  requiresApproval: boolean;
  autoProvisionAccess: boolean;
};

export type WorkOrderSummaryCardData = {
  _id: string;
  title: string;
  assignedContractorId: string;
  _creationTime: number;
  contractorFirstName?: string;
  contractorLastName?: string;
  contractorCompany?: string;
  status: string;
  priority: string;
};


export type EnhancedIssue = {
  _id: Id<'issues'>;
  locationId?: Id<'ticketLocations'>;
  linkedAssetId?: Id<'spaces' | 'facilities'>;
  linkedAssetType?: 'space' | 'facility';
  buildingId?: Id<'sites'>;
  status: string;
  title: string;
  priority: string;
  issueType: string;
  assignedToId?: string;
  facilityId?: Id<'facilities'>;
  spaceId?: Id<'spaces'>;
  description: string;
  tags: Array<{ value: string; label: string }>;
  followUpDate?: string;
  files?: Array<{
    url: string;
    storageId: string;
  }>;
  orgId: string;
  userId: string;
  floor?: string;
  locationName: string | null;
  linkedAssetName: string | null;
  buildingName: string | null;
  _creationTime: string;
};

export interface AdminUser {
  _id: Id<'allUsers'>;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  // Add any other properties that are stored in the allUsers table
}

export type ParcelData = {
  _id: string;
  spaceId: string;
  occupantId: string;
  parcelTypeId: string;
  numPackages: number;
  _creationTime: number;
  spaceName: string;
  description?: string;
  location: string;
  isCollected: boolean;
  orgId: string;
};

export type ValueLabelPair = {
  value: string;
  label: string;
};

export type Facility = {
  _id: Id<'facilities'>;
  _creationTime: number;
  name: string;
  description: string;
  facilityTypeId: Id<'facilityTypes'>;
  buildingId: Id<'sites'>;
  floor: string;
  isPublic: boolean;
  hasAudience: boolean;
  files: Array<{
    url: string;
    storageId: Id<'_storage'>;
  }>;
  audience?: Array<{
    type: string;
    entity: string;
  }>;
  orgId: string;
};

export type OfferCategory = {
  _id: string;
  name: string;
  description: string;
}

export type Announcement = {
  title: string;
  type: string;
  content: string;
  scheduleSend: boolean;
  _id?: string;
  audience?: Array<{
    type: string;
    entity: string;
  }>;
  dateTime?: Date;
};

export type PostData = {
  _id: string;
  authorId: string;
  isAdmin: boolean;
  status: string;
  authorName: string;
  _creationTime: string;
  title: string;
  content: string;
  images: Array<{
    url: string;
    storageId: string;
  }>;
}

export type OfferDetails = {
  _id?: string;
  title: string;
  type: string;
  offerDescription: string;
  colour: string;
  files: Array<{
    url: string;
    storageId: string;
  }>;
  startDate: Date;
  endDate: Date;
};

export type ActiveRequest = {
  vehicle: {
    make: string;
    model: string;
    year: number;
    rego: string;
  };
  positionInQueue: number;
  createdTime: string;
  currentStatus: string;
};

export type Allocation = {
  _id?: string;
  name: string;
  description?: string;
  allocatedParks: number;
  spaceId?: string;
  rentedSpaceId?: string;
  parkTypeId: string;
  occupiedParks: number;
};

export type Vehicle = {
  _id: string;
  rego: string;
  isParked: boolean;
  make: string;
  model: string;
  color: string;
  year: string;
  spaceId?: string;
  type: string;
  drivers?: { id: string }[];
  image?: { url: string; storageId: string }[];
  availableTo: 'space' | 'specific';
  orgId: string;
};