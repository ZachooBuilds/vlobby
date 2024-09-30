"use client";

import React from "react";

import ParkingHeader from "./_components/parking-header";
import RequestsOverview from "./_components/requests-overview";
import VehicleOverview from "./_components/vehicles-overview";
import AllocationOverview from "./_components/allocations-overview";
import ParkTypeOverview from "./_components/park-types-overview";
import CarParkMap from "./_components/parkingMapLoader";
import OperatorsOverview from "./_components/operators-overview";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";

function DashboardContent() {
  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <div className="w-full md:w-[50%]">
        {/* To do create parking log and way to select park on map and show parking recomendations */}
        <RequestsOverview />
      </div>
      <div className="w-full md:w-[50%]">
        <div className="flex w-full flex-col gap-4 p-2">
          <span className="text-md font-medium text-foreground">
            Vehicles (3)
          </span>
        </div>
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
    <div className="flex h-screen flex-col">
      <ParkingHeader />
      <div className="flex-grow overflow-hidden rounded-md bg-background p-2">
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
            {/* Vehicles content */}
            <VehicleOverview spaceId={""} />
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
