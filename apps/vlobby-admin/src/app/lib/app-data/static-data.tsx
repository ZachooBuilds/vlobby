import BookingUpsertForm from "../../admin/bookings/_forms/booking-upsert-form";
import EventUpsertForm from "../../admin/events/_forms/event-upsert-form";
import FacilityUpsertForm from "../../admin/facilities/_forms/facility-upsert-form";
import UpsertSiteForm from "../../admin/settings/general/_forms/upsert-building";
import SpaceTypeUpsertForm from "../../admin/settings/general/_forms/upsert-space-types";
import { UpsertTicketTypeForm } from "../../admin/settings/general/_forms/upsert-ticket-types";
import { UpsertOfferCategoryForm } from "../../admin/settings/general/_forms/upsert-offer-categories";
import { AccessibleIconPath, AccountIconPath, AnnouncementIconPath, BillingIconPath, BookingIconPath, BuildingIconPath, CarIconPath, ClubIconPath, CommunicationIconPath, ContractorIconPath, DashboardIconPath, DocumentsIconPath, EventIconPath, EvIconPath, FacilityIconPath, FeedIconPath, HammerIconPath, HandoverIconPath, HomeIconPath, InboxIconPath, IssueIconPath, KeyIconPath, LockIconPath, LogoIconPath, LogoPath, MailIconPath, NotesIconPath, NoticesIconPath, NotificationsIconPath, OccupantsIconPath, OffersIconPath, ParcelIconPath, ParkIconPath, PlanIconPath, RoleIconPath, SettingIconPath, SettlementIconPath, SpacesIconPath, StorageIconPath, SupportIconPath, TicketIconPath, TrashIconPath, UnderConstructionImage, WorkOrderIconPath } from "../icons/icons";
import { Feature, QuickActionMenuItem } from "./app-types";
import UpsertServiceLocationForm from "../../admin/settings/general/_forms/upsert-service-locations";
import FacilityTypeUpsertForm from "../../admin/settings/general/_forms/upsert-facility-types";
import KeyTypeUpsertForm from "../../admin/settings/general/_forms/upsert-key-types";
import AnnouncementUpsertForm from "../../admin/social/announcements/_forms/announcement-form";
import FeedPostUpsertForm from "../../admin/social/feed/_forms/feed_post_form";
import OccupantUpsertForm from "../../admin/occupants/_form/occupant-upsert";
import TicketUpsertForm from "../../admin/issues/_forms/issues-upsert-form";
import WorkOrderUpsertForm from "../../admin/work-orders/_forms/work-order-upsert-form";

// smaller size only the icons from the quick_actions categorey will be displayed
export const navigationItems = [
  {
    name: "Dashboard",
    category: "quick_actions",
    href: "/dashboard",
    icon: DashboardIconPath,
  },
  {
    name: "Communication",
    category: "quick_actions",
    href: "/communication",
    icon: CommunicationIconPath,
  },
  {
    name: "Social",
    category: "quick_actions",
    href: "/social/announcements",
    icon: AnnouncementIconPath,
  },
  {
    name: "Handover Notes",
    category: "quick_actions",
    href: "/handover-notes",
    icon: HandoverIconPath,
  },
  {
    name: "Bookings",
    category: "quick_actions",
    href: "/bookings",
    icon: BookingIconPath,
  },
  {
    name: "Events",
    category: "quick_actions",
    href: "/events",
    icon: EventIconPath,
  },
  {
    name: "Parcels",
    category: "quick_actions",
    href: "/parcels",
    icon: ParcelIconPath,
  },
  {
    name: "Billing",
    category: "quick_actions",
    href: "/billing",
    icon: BillingIconPath,
  },
  {
    name: "Issues",
    category: "maintainence",
    href: "/issues",
    icon: IssueIconPath,
  },
  {
    name: "Work Orders",
    category: "maintainence",
    href: "/work-orders",
    icon: WorkOrderIconPath,
  },
  {
    name: "Contractors",
    category: "maintainence",
    href: "/contractors",
    icon: ContractorIconPath,
  },
  {
    name: "Maintainence Plan",
    category: "maintainence",
    href: "/maintainence/assets",
    icon: HammerIconPath,
  },
  {
    name: "Key Register",
    category: "site_details",
    href: "/key-register",
    icon: KeyIconPath,
  },
  {
    name: "Devices",
    category: "site_details",
    href: "/devices",
    icon: LockIconPath,
  },
  {
    name: "Spaces",
    category: "site_details",
    href: "/spaces",
    icon: SpacesIconPath,
  },
  {
    name: "Occupants",
    category: "site_details",
    href: "/occupants",
    icon: OccupantsIconPath,
  },
  {
    name: "Facilities",
    category: "site_details",
    href: "/facilities",
    icon: FacilityIconPath,
  },
  {
    name: "Parking",
    category: "site_details",
    href: "/parking",
    icon: ParkIconPath,
  },
  {
    name: "EV Charging",
    category: "site_details",
    href: "/ev-charging",
    icon: EvIconPath,
  },
  {
    name: "Storage",
    category: "site_details",
    href: "/storage",
    icon: StorageIconPath,
  },
  {
    name: "Documents",
    category: "site_details",
    href: "/documents",
    icon: DocumentsIconPath,
  },
  {
    name: "Offers",
    category: "resident_services",
    href: "/offers",
    icon: OffersIconPath,
  },
  {
    name: "Settlement",
    category: "resident_services",
    href: "/settlement",
    icon: SettlementIconPath,
  },
];

export const socialMenu = [
  {
    name: 'Announcements',
    href: 'announcements',
    icon: AnnouncementIconPath,
  },
  {
    name: 'Feed',
    href: 'feed',
    icon: FeedIconPath,
  },
  {
    name: 'Clubs',
    href: 'clubs',
    icon: ClubIconPath,
  },
];

export const ImagePlaceholder = "https://utfs.io/f/7c385290-0f9e-486b-a61e-1ae97d2bd8b5-9w6i5v.webp";

export const ConfettiColors = [
  "#5236FF",
  "#7A62FF",
  "#3D1EE3",
  "#8C4DFF",
  "#2E0FCC",
  "#FF36D9",
  "#C736FF",
  "#9D36FF",
  "#FF36A6",
];

export const colorsList = [
  { name: 'Primary', hex: '#1847ED' },
  { name: 'Vibrant Blue', hex: '#00A3FF' },
  { name: 'Teal', hex: '#00D1C1' },
  { name: 'Navy', hex: '#0C2B9E' },
  { name: 'Royal Purple', hex: '#6A0DAD' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Deep Red', hex: '#C41E3A' },
]

export const glanceMenuItems = [
  {
    name: "Pending Announcements",
    tag: "pending_announcements",
    description: "Number of announcements to be sent out",
    href: "/social/announcements",
    icon: AnnouncementIconPath,
  },
  {
    name: "Pending Feed Posts",
    tag: "pending_feed_posts",
    description: "Number of feed posts to be moderated",
    href: "/social/feed",
    icon: FeedIconPath,
  },
  {
    name: "Open Handover Notes",
    tag: "open_handover_notes",
    description: "Number of handover notes with status open",
    href: "/handover-notes",
    icon: HandoverIconPath,
  },
  {
    name: "Pending Bookings",
    tag: "pending_bookings",
    description: "Number of bookings to be approved",
    href: "/bookings",
    icon: BookingIconPath,
  },
  {
    name: "Active Valet Requests",
    tag: "active_valet_requests",
    description: "Number of active valet requests",
    href: "/parking",
    icon: ParkIconPath,
  },
  {
    name: "Active Issues",
    tag: "active_issues",
    description: "Number of issues with status open",
    href: "/issues",
    icon: IssueIconPath,
  },
  {
    name: "Accessible Units",
    tag: "accessible_units",
    description: "Number of accessible units",
    href: "/spaces",
    icon: AccessibleIconPath,
  },
  {
    name: "Active Work Orders",
    tag: "active_work_orders",
    description: "Number of active work orders",
    href: "/work-orders",
    icon: WorkOrderIconPath,
  },
];

export const quickActionMenuItems: QuickActionMenuItem[] = [
  {
    name: "Create Announcement",
    href: "social/announcements",
    icon: AnnouncementIconPath,
    description: "Post a new announcement for residents",
  },
  {
    name: "Manage Bookings",
    href: "bookings",
    icon: BookingIconPath,
    description: "View and manage facility bookings",
  },
  {
    name: "Handle Parcels",
    href: "parcels",
    icon: ParcelIconPath,
    description: "Process incoming and outgoing parcels",
  },
  {
    name: "Respond to Issues",
    href: "issues",
    icon: IssueIconPath,
    description: "Address reported issues and maintenance requests",
  },
  {
    name: "Schedule Event",
    href: "events",
    icon: EventIconPath,
    description: "Plan and schedule a new community event",
  },
  {
    name: "Update Occupants",
    href: "occupants",
    icon: OccupantsIconPath,
    description: "Manage resident information and access",
  },
  {
    name: "Facility Maintenance",
    href: "maintainence/plan",
    icon: FacilityIconPath,
    description: "Schedule or review facility maintenance tasks",
  },
  {
    name: "Key Management",
    href: "key-register",
    icon: KeyIconPath,
    description: "Manage key checkouts and returns",
  },
  
];

export const IconMap = {
  Dashboard: DashboardIconPath,
  Communication: CommunicationIconPath,
  Announcement: AnnouncementIconPath,
  Handover: HandoverIconPath,
  Booking: BookingIconPath,
  Event: EventIconPath,
  Parcel: ParcelIconPath,
  Billing: BillingIconPath,
  Contractor: ContractorIconPath,
  UnderConstruction: UnderConstructionImage,
  Accessible: AccessibleIconPath,
  Account: AccountIconPath,
  Club: ClubIconPath,
  Feed: FeedIconPath,
  Building: BuildingIconPath,
  Car: CarIconPath,
  Documents: DocumentsIconPath,
  Ev: EvIconPath,
  Facility: FacilityIconPath,
  Home: HomeIconPath,
  Inbox: InboxIconPath,
  Key: KeyIconPath,
  Lock: LockIconPath,
  Mail: MailIconPath,
  Hammer: HammerIconPath,
  Notes: NotesIconPath,
  Notices: NoticesIconPath,
  Notifications: NotificationsIconPath,
  Occupants: OccupantsIconPath,
  Offers: OffersIconPath,
  Park: ParkIconPath,
  Plan: PlanIconPath,
  Role: RoleIconPath,
  Setting: SettingIconPath,
  Settlement: SettlementIconPath,
  Spaces: SpacesIconPath,
  Storage: StorageIconPath,
  Support: SupportIconPath,
  Ticket: TicketIconPath,
  Trash: TrashIconPath,
  WorkOrder: WorkOrderIconPath,
  Logo: LogoPath,
  LogoIcon: LogoIconPath,
};

export const spaceRoleOptions = [
  { id: 'vl:owner', name: 'Owner' },
  { id: 'vl:owner-occupier', name: 'Owner Occupier' },
  { id: 'vl:occupant', name: 'Occupant' },
  { id: 'vl:tenant', name: 'Tenant' },
];

export const FormMap = {
  // FacilityUpsert: FacilityUpsertForm,
  FacilityTypeUpsert: FacilityTypeUpsertForm,
  BookingUpsertForm: BookingUpsertForm,
  SpaceTypeUpsertForm: SpaceTypeUpsertForm,
  TicketTypeUpsertForm: UpsertTicketTypeForm,
  OfferCategoryUpsertForm: UpsertOfferCategoryForm,
  ServiceLocationUpsertForm: UpsertServiceLocationForm,
  BuildingUpsertForm: UpsertSiteForm,
  OccupantUpsertForm: OccupantUpsertForm,
  // OfferUpsertForm: OfferUpsertForm,
  // SpaceUpsertForm: SpaceUpsertForm,
  FacilityUpsertForm: FacilityUpsertForm,
  // ContractorUpsertForm: ContractorUpsertForm,
  TicketUpsertForm: TicketUpsertForm,
  WorkOrderUpsertForm: WorkOrderUpsertForm,
  // FileUpsertForm: UpsertFileForm,
  // StorageUpsertForm: StorageUpsertForm,
  KeyTypeUpsertForm: KeyTypeUpsertForm,
  // KeyUpsertForm: KeyUpsertForm,
  // ParcelUpsertForm: ParcelUpsertForm,
  EventUpsertForm: EventUpsertForm,
  // HandoverNoteUpsertForm: HandoverNoteUpsertForm,
  AnnouncementUpsertForm: AnnouncementUpsertForm,
  FeedPostUpsertForm: FeedPostUpsertForm,

};

  export const dayWeekOptions = [
    { value: "d:1", label: "Monday" },
    { value: "d:2", label: "Tuesday" },
    { value: "d:3", label: "Wednesday" },
    { value: "d:4", label: "Thursday" },
    { value: "d:5", label: "Friday" },
    { value: "d:6", label: "Saturday" },
    { value: "d:7", label: "Sunday" },
  ];

export const settingsMenu = [
  {
    name: "General",
    href: "general",
  },
  {
    name: "Features",
    href: "features",
  },
  {
    name: "Theme",
    href: "theme",
  },
  {
    name: "Billing",
    href: "billing",
  },
  {
    name: "Integrations",
    href: "integrations",
  },
  {
    name: "Plan & Account",
    href: "plan-account",
  },
];


export const featuresList: Feature[] = [
  {
    feature: "Billing",
    description: "Manage and track financial transactions and invoices.",
  },
  {
    feature: "Bookings",
    description: "Schedule and manage reservations for various amenities.",
  },
  {
    feature: "Parking",
    description: "Allocate and monitor parking spaces within the property.",
  },
  {
    feature: "Communication",
    description: "Facilitate messaging and notifications between users.",
  },
  {
    feature: "Documents",
    description: "Store and manage important files and paperwork.",
  },
  {
    feature: "EV Charging",
    description: "Manage electric vehicle charging stations and usage.",
  },
  {
    feature: "Events",
    description: "Plan and coordinate community events and activities.",
  },
  {
    feature: "Facilities",
    description: "Oversee and maintain common areas and amenities.",
  },
  {
    feature: "Handover Notes",
    description: "Record and share important information during shift changes.",
  },
  {
    feature: "Issues",
    description: "Track and resolve reported problems or concerns.",
  },
  {
    feature: "Work Orders",
    description: "Create and manage maintenance and repair requests.",
  },
  {
    feature: "Incidents",
    description: "Log and handle unexpected events or emergencies.",
  },
  {
    feature: "Hazards",
    description: "Identify and manage potential safety risks.",
  },
  {
    feature: "Inductions",
    description: "Manage orientation processes for new residents or staff.",
  },
  {
    feature: "Notices",
    description: "Publish and distribute important announcements.",
  },
  {
    feature: "Parcels",
    description: "Track and manage package deliveries and pickups.",
  },
  {
    feature: "Offers",
    description: "Manage and promote special deals or promotions.",
  },
  {
    feature: "Pets",
    description: "Register and manage pet-related information and policies.",
  },
  {
    feature: "Storage",
    description: "Allocate and track usage of storage spaces.",
  },
  {
    feature: "Key Register",
    description: "Manage and track keys for various property areas.",
  },
  {
    feature: "Valet",
    description: "Coordinate valet parking services for residents and guests.",
  },
];
