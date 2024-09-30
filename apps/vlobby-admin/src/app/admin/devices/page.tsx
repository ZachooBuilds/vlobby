import SectionHeader from '../_components/global-components/section-header';
import UnderConstructionMessage from '../_components/global-components/under-construction';

export default function DevicesPage() {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-2">
      <SectionHeader
        title="Devices"
        description="Manage and view all devices connected to your property. You can add new devices, update existing ones, and monitor their status."
        buttonText="Add Device"
        sheetTitle="Add New Device"
        sheetDescription="Enter details to add a new device"
        icon="Lock"
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-background p-4">
        <UnderConstructionMessage />
      </div>
    </div>
  );
}
