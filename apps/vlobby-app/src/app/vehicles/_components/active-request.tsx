"use client"
import React from 'react';

import { ParkingSquare } from 'lucide-react';
import { requestStatuses } from '../../../lib/staticData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Progress } from '@repo/ui/components/ui/progress';
import { ActiveRequest } from '../../../lib/app-types';

interface ActiveRequestProps {
  request: ActiveRequest;
}

export function ActiveRequestCard({ request }: ActiveRequestProps) {
  const currentStageIndex = requestStatuses.indexOf(request.currentStatus);
  const progressValue =
    (currentStageIndex / (requestStatuses.length - 1)) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          <ParkingSquare className="inline-block mr-2" />
          {request.vehicle.rego}
        </CardTitle>
        <div className="text-sm font-medium">
          Position {request.positionInQueue} in Queue
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <Progress value={progressValue} className="w-full" />
        </div>
        <div className="flex justify-between mt-2">
          {requestStatuses.map((status, index) => (
            <div
              key={status}
              className={`text-sm ${
                index <= currentStageIndex
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-600 mt-4">
          <p>
            {request.vehicle.year} {request.vehicle.make}{' '}
            {request.vehicle.model}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
