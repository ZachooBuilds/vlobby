import { Id } from "@repo/backend/convex/_generated/dataModel";
import { BookingFormData } from "../../admin/bookings/_forms/booking-validation";
import { EventFormData } from "../../admin/events/_forms/event-validation";
import { FacilityFormData } from "../../admin/facilities/_forms/facility-validation";
import { FormMap, IconMap } from "./static-data";
import { AttendeeFormData } from "../../admin/events/_forms/atendee-validation";

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


