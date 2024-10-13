'use client';

import React from 'react';
import NavigationBar from '../_components/navigation';
import ViewSwitcher from '../_components/view-switcher';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { startOfDay, endOfDay } from 'date-fns';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  CustomPieChart,
  PieChartData,
} from '../_components/charts/custom-pie-chart';
import {
  RadialChart,
  RadialChartDataItem,
} from '../_components/charts/custom-radial-chart';

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end flex-grow">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const today = new Date();
  const startOfToday = startOfDay(today).toISOString();
  const endOfToday = endOfDay(today).toISOString();

  const avgDropoffServiceTime = useQuery(
    api.requests.getAverageDailyServiceTime,
    {
      startDate: startOfToday,
      endDate: endOfToday,
      requestType: 'dropoff:vehicle',
    }
  );

  const avgPickupServiceTime = useQuery(
    api.requests.getAverageDailyServiceTime,
    {
      startDate: startOfToday,
      endDate: endOfToday,
      requestType: 'pickup:vehicle',
    }
  );

  const currentlyParkedCars = useQuery(api.requests.getCurrentlyParkedCars);

  const requestTypeData = useQuery(
    api.requests.getTotalRequestsByType
  ) as PieChartData[];

  const requestByOperator = useQuery(
    api.requests.getTotalCompletedRequestsByOperator
  ) as PieChartData[];

  const activeParkTypeSummary = useQuery(
    api.requests.getActiveParkTypeSummary
  ) as RadialChartDataItem[];

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="w-full mb-4">
            <ViewSwitcher />
          </div>
          <span className="text-md font-medium text-foreground">
            Daily Metrics
          </span>
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Avg Dropoff Time"
              value={avgDropoffServiceTime ?? 'N/A'}
            />
            <MetricCard
              title="Avg Pickup Time"
              value={avgPickupServiceTime ?? 'N/A'}
            />
            {/* <MetricCard
              title="Currently Parked Cars"
              value={currentlyParkedCars ?? 'N/A'}
            /> */}
          </div>
          <div className="flex flex-row gap-4 w-full">
            {requestTypeData ? (
              <CustomPieChart
                data={requestTypeData}
                title="Total Requests"
                description="Distribution of request types"
                totalLabel="Requests"
              />
            ) : (
              <LoadingSpinner />
            )}
            {requestByOperator ? (
              <CustomPieChart
                data={requestByOperator}
                title="Requests by Operator"
                description="Completed requests by operator"
                totalLabel="Requests"
              />
            ) : (
              <LoadingSpinner />
            )}
          </div>
          {activeParkTypeSummary ? (
            <RadialChart
              data={activeParkTypeSummary}
              title="Active Park Types"
              description="Distribution of currently active park types"
            />
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[250px] w-full">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
