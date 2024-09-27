/**
 * GlanceItemSummary Component
 * 
 * This component renders a grid of summary cards for quick access to various admin sections.
 * It uses client-side data fetching with Convex, so it's marked as a client component.
 *
 * @returns {JSX.Element} The rendered GlanceItemSummary component
 */
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Card } from "@repo/ui/components/ui/card";
import { glanceMenuItems } from "../../../lib/app-data/static-data";

export default function GlanceItemSummary() {
  /**
   * Fetch dashboard summary data from the Convex backend
   * This uses the useQuery hook from Convex, similar to how it's used in ConvexClientProvider
   */
  const summaryItems = useQuery(api.dashboard.getDashboardSummary);

  return (
    <Card className="grid grid-cols-1 gap-2 rounded-md p-2 md:grid-cols-2 lg:grid-cols-3">
      {glanceMenuItems.map((option, index) => (
        <Link
          key={index}
          href={`/admin/${option.href}`}
          className="w-full text-start"
        >
          <div className="group flex h-full flex-col gap-2 rounded-md p-4 transition-colors duration-300 hover:bg-muted">
            <div className="flex flex-row items-center gap-2 pb-2">
              <div className="flex items-center justify-center rounded-md bg-muted p-2 transition-colors duration-300 group-hover:bg-background">
                <svg className="h-4 w-4 fill-foreground" viewBox="0 0 24 24">
                  <option.icon />
                </svg>
              </div>
              <div className="text-sm font-medium transition-all duration-300 group-hover:font-semibold">
                {option.name}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start p-1">
              <div className="text-2xl font-bold">
                {/**
                 * Display the value for the corresponding tag from the summary items
                 * This is similar to how data might be used in components wrapped by ConvexProviderWithClerk
                 */}
                {summaryItems?.find((item) => item.tag === option.tag)?.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </Card>
  );
}
