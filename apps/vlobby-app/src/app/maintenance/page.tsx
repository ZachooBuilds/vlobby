'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NavigationBar from '../_components/navigation';
import { HammerIconPath } from '../../../public/svg/icons';
import { api } from '@repo/backend/convex/_generated/api';
import { useQuery } from 'convex/react';
import { EnhancedIssue } from '../../lib/app-types';
import IssueSummaryCard from './_components/issue-card';
import useDrawerStore from '../../lib/global-state';
import { Badge } from '@tremor/react';
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
import NoData from '../_components/no-data';

export default function MaintenancePage() {
  // Fetch all occupant issues
  const issues = useQuery(api.tickets.getAllOccupantIssues) as
    | EnhancedIssue[]
    | undefined;

  // Filter issues into resolved and open
  const resolvedIssues = issues?.filter(
    (issue) => issue.status === 'Resolved' || issue.status === 'Closed'
  ) as EnhancedIssue[];

  const openIssues = issues?.filter(
    (issue) => issue.status !== 'Resolved' && issue.status !== 'Closed'
  ) as EnhancedIssue[];

  // Access the global drawer state
  const { openDrawer } = useDrawerStore();

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
      // openDrawer(
      //   'Edit Issue',
      //   'Edit the selected maintenance issue.',
      //   <IssuesUpsertForm selectedIssue={selectedIssue as Issue} />
      // );
    }
  };

  // Handler for selecting a work order
  const handleWorkOrderSelect = (workOrderId: Id<'workOrders'>) => {
    setSelectedWorkOrder(workOrderId);
  };

  return (
    <div className="flex flex-col h-screen">
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
                    {selectedIssue ? 'Issue Details' : 'Maintenance Issues'}
                  </h2>
                  {!selectedIssue && (
                    <Badge
                      size="xs"
                      color="purple"
                    >{`${openIssues?.length || 0} Open Issues`}</Badge>
                  )}
                </div>
              </div>
            </div>
            {selectedIssue ? (
              <Button onClick={handleIssueEdit}>Edit Issue</Button>
            ) : (
              <Link href="/maintenance/new-issue" passHref>
                <Button >Report Issue</Button>
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
                <h2 className="text-xl font-semibold mb-4">Open Issues</h2>
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
                  <h2 className="text-xl font-semibold">Resolved Issues</h2>
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
      <NavigationBar />
    </div>
  );
}
