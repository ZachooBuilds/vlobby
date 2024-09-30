import SectionHeader from "../../_components/global-components/section-header";
import UnderConstructionMessage from "../../_components/global-components/under-construction";
import SocialNavigation from "../_components/social-navigation";

export default function ClubsPage() {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-2">
      <SectionHeader
        title="Social"
        description="Create and manage clubs to foster community engagement. Organize activities, events, and interest groups for your residents."
        buttonText="New Club"
        sheetTitle="Create Club"
        sheetDescription="Create a new club"
        icon={"Club"}
      />
      <SocialNavigation />

      <div className=" flex h-full w-full items-center justify-center rounded-lg bg-background p-2 ">
        <UnderConstructionMessage />
      </div>
    </div>
  );
}
