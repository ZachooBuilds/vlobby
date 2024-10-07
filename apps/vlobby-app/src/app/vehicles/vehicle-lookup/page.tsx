'use client';

import React from 'react';
import Link from 'next/link';
import NavigationBar from '../../_components/navigation';
import { CarIconPath } from '../../../../public/svg/icons';
import VehicleLookup from '../_forms/vehicle-lookup';
import AddVehicleForm from '../_forms/add-vehicle';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function VehicleLookupPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <CarIconPath />
            </div>
            <h2 className="text-xl font-semibold">Vehicle Lookup</h2>
          </div>
          <Link href="/vehicles">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 fill-foreground">
                    <CarIconPath />
                  </div>
                  Vehicle Lookup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VehicleLookup />
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Manual Vehicle Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Feel like doing it yourself?</p>
                <AddVehicleForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
