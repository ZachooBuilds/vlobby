import SectionHeader from "../_components/global-components/section-header";
import UnderConstructionMessage from "../_components/global-components/under-construction";


export default function SettlementPage() {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-2">
      <SectionHeader
        title="Settlement"
        description="Manage and view all settlement information for your property. You can review transactions, track payouts, and generate settlement reports."
        buttonText="Process Settlement"
        sheetTitle="Process New Settlement"
        sheetDescription="Enter details to process a new settlement"
        icon="Settlement"
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-background p-4">
        <UnderConstructionMessage />
      </div>
    </div>
  );
}
