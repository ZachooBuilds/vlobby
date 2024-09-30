import SectionHeader from "../_components/global-components/section-header";
import UnderConstructionMessage from "../_components/global-components/under-construction";


export default function EVChargingPage() {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-2">
      <SectionHeader
        title="EV Charging"
        description="Manage and monitor electric vehicle charging stations in your property. View usage statistics, set pricing, and control access to charging points."
        buttonText="Add Charging Station"
        sheetTitle="Add New Charging Station"
        sheetDescription="Enter details to add a new EV charging station"
        icon="Ev"
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-background p-4">
        <UnderConstructionMessage />
      </div>
    </div>
  );
}
