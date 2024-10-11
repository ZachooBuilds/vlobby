import { Id } from "@repo/backend/convex/_generated/dataModel";
import { BookingFormData } from "../../admin/bookings/_forms/booking-validation";
import { EventFormData } from "../../admin/events/_forms/event-validation";
import { FacilityFormData } from "../../admin/facilities/_forms/facility-validation";
import { FormMap, IconMap } from "./static-data";
import { AttendeeFormData } from "../../admin/events/_forms/atendee-validation";
import { AnnouncementFormData } from "../../admin/social/announcements/_forms/announcement-validation";
import { IssueFormData } from "../../admin/issues/_forms/issues-validation";
import { WorkOrderFormData } from "../../admin/work-orders/_forms/work-order-validation";
import { ParcelFormData } from "../../admin/parcels/_forms/parcel-validation";
import { KeyFormData } from "../../admin/key-register/_forms/key-validation";
import { KeyLogFormData } from "../../admin/key-register/_forms/key-log-validation";
import { Allocation } from "../../admin/parking/_forms/allocation-validation";
import { StorageFormData } from "../../admin/storage/_forms/storage-validation";

export type IconImage = {
  url: string;
};

export type Feature = {
  feature: string;
  description?: string;
  enabled?: boolean;
};

/**
 * @type CalenderEvent
 * @description Extends BookingFormData to include booking type name and user name, this is read from the form validation schema located in the same directory as the form component
 * @property {string} bookingTypeName - The name of the booking type
 * @property {string} userName - The name of the user
 */
export type CalenderEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  date: Date;
  extendedProps: {
    linkedAssetId: string;
    linkedAssetName: string;
    userName?: string;
    bottomText?: string;
    bookingData?: BookingFormData;
    eventData?: EventFormData;
  };
};

export type EventWithSpaceName = EventFormData & {
  facilityName: string;
};

/**
 * @type FacilityFormDataWithNames
 * @description Extends FacilityFormData to include building and facility type names, this is read from the form validation schema located in the same directory as the form component
 * @property {string} buildingName - The name of the building associated with the facility
 * @property {string} facilityTypeName - The name of the facility type
 */
export type FacilityFormDataWithNames = FacilityFormData & {
  buildingName: string;
  facilityTypeName: string;
};

export type QuickActionMenuItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

/**
 * @type BookingFormDataWithNames
 * @description Extends BookingFormData to include booking type name and user name, this is read from the form validation schema located in the same directory as the form component
 * @property {string} bookingTypeName - The name of the booking type
 * @property {string} userName - The name of the user
 */
export type BookingFormDataWithNames = BookingFormData & {
  startTime: Date;
  status?: "pending" | "approved" | "rejected";
  endTime: Date;
  bookingTypeName: string;
  userName: string;
  facilityName: string;
};

export type IconName = keyof typeof IconMap;
export type FormType = keyof typeof FormMap;

export type ValueLabelPair = {
  value: string;
  label: string;
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

export type EventAttendeeWithOccupantDetails = AttendeeFormData & {
  occupantName: string;
  occupantEmail: string;
};

export type AllocationDetails = Allocation & {
  parkTypeName: string;
};

export type ParcelTableData = ParcelFormData & {
  spaceName: string;

  occupantName: string;

  parcelTypeName: string;
};


export type FolderSummaryData = {
  _id: string;
  name: string;
  fileCount: string;
};

 export type ImageUrlAndId = {
   url: string;
   storageId: Id<'_storage'>;
 };

 
export type FileSummaryData = {
  _id: string;
  name: string;
  type: string;
  folderName: string;
  fileUrl: string;
  fileStorageId: string;
  views: number;
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

export type StorageSummaryTableData = StorageFormData & {
  spaceName: string;
};

export type VehicleInfo = {
  _id: string;
  rego: string;
  make: string;
  model: string;
  color: string;
  year: string;
  spaceId: string;
  type: string;
  image?: { url: string; storageId: string }[];
  lastActivity?: Date;
  isParked: boolean;
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


export type KeyTableData = KeyFormData & {
  keyTypeName: string;
  spaceName: string;
  isOutKey: boolean;
};

export type OutKeysSummaryData = KeyLogFormData & {
  keyTypeName: string;
  spaceName: string;
  userName: string;
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

export type AssignedUserWithWorkOrderDetails = UserCoreDetails &
  WorkOrderFormData & {
    assignedFirstName?: string;
    assignedLastName?: string;
    creationFirstName?: string;
    creationLastName?: string;
    creationEmail?: string;
  };

export type WorkOrderFormDataWithNames = WorkOrderFormData & {
  assignedContractor: {
    name: string;
    businessName: string;
    email: string;
  } | null;
  userId: string;
  _creationTime: string;
  locationName: string;
  linkedAssetName: string;
  buildingName: string;
};

export type AssignedUserWithFormDetails = UserCoreDetails &
  IssueFormData & {
    assignedFirstName?: string;
    assignedLastName?: string;
    creationFirstName?: string;
    creationLastName?: string;
    creationEmail?: string;
  };


export type IssueFormDataWithNames = IssueFormData & {
  userId: string;
  _creationTime: string;
  locationName: string;
  linkedAssetName: string;
  buildingName: string;
};

export type IssueSummaryCardData = {
  _id: string;
  title: string;
  description: string;
  _creationTime: number;
  followUpDate: number;
  issueType: string;
  status: string;
  priority: string;
};


export type UserCoreDetails = {
  firstname?: string;
  lastname?: string;
  email?: string;
};

export type ChatSummary = {
  _id: string;
  occupantId: string;
  OccupantName: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadMessage: boolean;
};

export type Message = {
  chatId: string;
  content: string;
  createdAt: string;
  isFromOccupant: boolean;
};

export type AnnouncementTableEntry = AnnouncementFormData & {
  status: 'draft' | 'scheduled' | 'sent';
  views: number;
  user: string;
};

