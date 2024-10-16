'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@repo/backend/convex/_generated/api';
import { useQuery } from 'convex/react';
import IssueSummaryCard from './_components/issue-card';
import { Button } from '@repo/ui/components/ui/button';
import IssueOverview from './_components/issue-overview';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@repo/ui/components/ui/tabs';
import IssueWorkOrders from './_components/issue-work-orders';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import WorkOrderOverview from './_components/work-order-overview';
import { CheckCircle, Loader2 } from 'lucide-react';
import { EnhancedIssue } from '../../../lib/app-types';
import useDrawerStore from '../../../lib/global-state';
import { HammerIconPath } from '../../../../public/svg/icons';
import NoData from '../../_components/no-data';
import NavigationBarMaintenance from '../../_components/navigation-maintenance';
import { Skeleton } from '@repo/ui/components/ui/skeleton';

export default function MaintenancePage() {
  // Fetch all occupant issues
  const issues = useQuery(api.tickets.getAllAssignedIssues) as EnhancedIssue[];

  // Filter issues into resolved and open
  const resolvedIssues = issues?.filter(
    (issue) => issue.status === 'Resolved' || issue.status === 'Closed'
  );

  const openIssues = issues?.filter(
    (issue) => issue.status !== 'Resolved' && issue.status !== 'Closed'
  ) as EnhancedIssue[];

  // Local state for selected issue and work order
  const [selectedIssue, setSelectedIssue] = useState<EnhancedIssue | null>(
    null
  );

  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<Id<'workOrders'> | null>(null);

  // Handler for selecting an issue
  const handleIssueSelect = (issue: EnhancedIssue) => {
    setSelectedIssue(issue);
    setSelectedWorkOrder(null);
  };

  // Handler for editing an issue
  const handleIssueEdit = () => {
    if (selectedIssue) {
    }
  };

  // Handler for selecting a work order
  const handleWorkOrderSelect = (workOrderId: Id<'workOrders'>) => {
    setSelectedWorkOrder(workOrderId);
  };

  // If data is still loading, show the LoadingSpinner
  if (!issues) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          {/* Header */}
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4">
                <div className="w-5 h-5 fill-foreground">
                  <HammerIconPath />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">
                    {selectedIssue ? 'Issue Details' : 'Assigned Jobs'}
                  </h2>
                </div>
              </div>
            </div>
            {selectedIssue ? null : (
              <Link href="/maintenance/issues/new-issue" passHref>
                <Button>Report Issue</Button>
              </Link>
            )}
          </div>

          {/* Main Content */}
          {selectedIssue ? (
            // Selected Issue View
            <div className="w-full">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="w-full">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="workorders" className="w-full">
                    Work Orders
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <IssueOverview
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                  />
                </TabsContent>
                <TabsContent value="workorders">
                  {selectedWorkOrder ? (
                    <WorkOrderOverview
                      workOrderId={selectedWorkOrder}
                      onClose={() => setSelectedWorkOrder(null)}
                    />
                  ) : (
                    <IssueWorkOrders
                      issueId={selectedIssue._id}
                      onSelectWorkOrder={handleWorkOrderSelect}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Issues List View
            <div className="w-full">
              {/* Open Issues */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Open Jobs</h2>
                {issues === undefined ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : openIssues.length === 0 ? (
                  <NoData
                    badgeText="No open issues"
                    title="No open issues"
                    description="You don't have any open maintenance issues at the moment."
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {openIssues.map((issue) => (
                      <IssueSummaryCard
                        key={issue._id}
                        issue={issue}
                        onSelect={() => handleIssueSelect(issue)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Resolved Issues */}
              <div>
                <div className="flex flex-row items-center gap-4 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Resolved Jobs</h2>
                </div>
                {issues === undefined ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : resolvedIssues.length === 0 ? (
                  <NoData
                    badgeText="No resolved issues"
                    title="No resolved issues"
                    description="You don't have any resolved maintenance issues."
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {resolvedIssues.map((issue) => (
                      <IssueSummaryCard
                        key={issue._id}
                        issue={issue}
                        onSelect={() => handleIssueSelect(issue)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Navigation Bar */}
      <NavigationBarMaintenance />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 p-4 pt-16 pb-[120px]">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-4">
              <div className="w-5 h-5 fill-foreground">
                <HammerIconPath />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{'Assigned Jobs'}</h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold mb-4">Open Jobs</h2>
            <Skeleton className="w-full h-[400px] rounded-md" />
            <h2 className="text-xl font-semibold mb-4">Resolved</h2>
            <Skeleton className="w-full h-[400px] rounded-md" />
          </div>
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}
