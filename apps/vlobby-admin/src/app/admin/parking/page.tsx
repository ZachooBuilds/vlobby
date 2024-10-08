'use client';

import React from 'react';

import ParkingHeader from './_components/parking-header';
import RequestsOverview from './_components/requests-overview';
import VehicleOverview from './_components/vehicles-overview';
import AllocationOverview from './_components/allocations-overview';
import ParkTypeOverview from './_components/park-types-overview';
import CarParkMap from './_components/parkingMapLoader';
import OperatorsOverview from './_components/operators-overview';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import {
  CustomPieChart,
  PieChartData,
} from '../_components/charts/custom-pie-chart';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import {
  RadialChart,
  RadialChartDataItem,
} from '../_components/charts/custom-radial-chart';
import { startOfDay, endOfDay } from 'date-fns';
import { Loader2 } from 'lucide-react';

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end flex-grow">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
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

  console.log('request Typedata', requestTypeData);

  const requestByOperator = useQuery(
    api.requests.getTotalCompletedRequestsByOperator
  ) as PieChartData[];

  const activeParkTypeSummary = useQuery(
    api.requests.getActiveParkTypeSummary
  ) as RadialChartDataItem[];

  return (
    <div className="flex flex-row gap-4">
      <div className="w-[60%] flex flex-col gap-4">
        <span className="text-md font-medium text-foreground ">
          Daily Metrics
        </span>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Avg Dropoff Time"
            value={avgDropoffServiceTime ?? 'N/A'}
          />
          <MetricCard
            title="Avg Pickup Time"
            value={avgPickupServiceTime ?? 'N/A'}
          />
          <MetricCard
            title="Currently Parked Cars"
            value={currentlyParkedCars ?? 'N/A'}
          />
        </div>
        <div className="flex flex-row gap-4 mb-4">
          {requestTypeData ? (
            <CustomPieChart
              data={requestTypeData}
              title="Request Types"
              description="Distribution of request types"
              totalLabel="Requests"
            />
          ) : (
            <div className="flex items-center justify-center h-[250px] w-full">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}
          {requestByOperator ? (
            <CustomPieChart
              data={requestByOperator}
              title="Requests by Operator"
              description="Completed requests by operator"
              totalLabel="Requests"
            />
          ) : (
            <div className="flex items-center justify-center h-[250px] w-full">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}
        </div>
        {activeParkTypeSummary ? (
          <RadialChart
            data={activeParkTypeSummary}
            title="Active Park Types"
            description="Distribution of currently active park types"
          />
        ) : (
          <div className="flex items-center justify-center h-[250px] w-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        )}
      </div>
      <div className="w-[40%] flex-grow ">
        <RequestsOverview />
      </div>
    </div>
  );
}

function MapContent() {
  return (
    <Card className="flex-grow overflow-hidden">
      <CardContent className="h-full p-0">
        <CarParkMap />
      </CardContent>
    </Card>
  );
}

export default function ParkingPage() {
  return (
    <div className="flex flex-col">
      <ParkingHeader />
      <div className="flex flex-col rounded-md bg-background p-2">
        <Tabs defaultValue="dashboard" className="flex h-full flex-col">
          <div>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
              <TabsTrigger value="parktypes">Park Types</TabsTrigger>
              <TabsTrigger value="operators">Operators</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="dashboard">
            <DashboardContent />
          </TabsContent>
          <TabsContent value="map" className="flex-grow overflow-hidden">
            <MapContent />
          </TabsContent>
          <TabsContent value="vehicles">
            <VehicleOverview spaceId={''} />
          </TabsContent>
          <TabsContent value="allocations">
            <AllocationOverview />
          </TabsContent>
          <TabsContent value="parktypes">
            <ParkTypeOverview />
          </TabsContent>
          <TabsContent value="operators">
            <OperatorsOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
