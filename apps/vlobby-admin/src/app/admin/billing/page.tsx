import SectionHeader from "../_components/global-components/section-header";
import UnderConstructionMessage from "../_components/global-components/under-construction";


export default function DevicesPage() {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-2">
      <SectionHeader
        title="Billing"
        description="Manage and view all billing information for your property. You can review invoices, track payments, and generate financial reports."
        buttonText="Add Invoice"
        sheetTitle="Add New Invoice"
        sheetDescription="Enter details to add a new invoice"
        icon="Billing"
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-background p-4">
        <UnderConstructionMessage />
      </div>
    </div>
  );
}
