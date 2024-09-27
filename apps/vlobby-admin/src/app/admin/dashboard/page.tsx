import GlanceItemSummary from "./_components/glance-item-summary";
import QuickActionMenu from "./_components/quick-action-menu";
import UnderConstruction from "../_components/global-components/under-construction";
import { Card } from "@repo/ui/components/ui/card";
import Calendar from "../_components/calender/calender";

/**
 * DashboardPage Component
 * 
 * This component renders the main admin dashboard layout with various summary components and a calendar.
 * It provides an overview of key metrics and quick access to important actions.
 *
 * @returns {JSX.Element} The rendered dashboard page
 */
export default async function DashboardPage() {
  // TODO: Implement fetching of maintenance summary data metrics for dashboard

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        {/**
         * Main grid container for dashboard components
         * Responsive layout: single column on small screens, three columns on medium and larger screens
         */}
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          {/**
           * Left column container
           * Spans 2 columns on medium screens and above
           * Contains summary components and placeholder for maintenance issues
           */}
          <div className="space-y-2 md:col-span-2">
            {/* GlanceItemSummary: Displays a summary of all main metrics */}
            <GlanceItemSummary />
            {/* Placeholder for DefectBreakdown component (currently commented out) */}
            {/* <DefectBreakdown {...defectData} /> */}
            {/* UnderConstruction: Temporary component for features in development */}
            <div className="flex flex-col items-center justify-center">
            <UnderConstruction />
            </div>
          </div>
          {/**
           * Right column: Quick action menu
           * Provides easy access to frequently used actions
           */}
          <QuickActionMenu />
        </div>
        {/**
         * Full-width calendar component
         * Wrapped in a Card for consistent styling
         */}
        <Card className="w-full p-4">
          <Calendar />
        </Card>
      </div>
    </div>
  );
}
