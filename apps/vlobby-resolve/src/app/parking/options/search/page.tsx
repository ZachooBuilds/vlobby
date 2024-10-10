'use client';
import React from 'react';
import NavigationBar from '../../../_components/navigation';
import VehicleSearch from '../_components/search';
import ParkingOptionsTabs from '../_components/tab-menu';
import NewRequestForm from '../_forms/new-pickup-request';
import { ParkIconPath } from '../../../../../public/svg/icons';

export default function SearchPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <ParkingOptionsTabs />
          <VehicleSearch />
          <NewRequestForm />
        </div>
      </div>
      <div className="w-full bg-white">
        <NavigationBar />
      </div>
    </div>
  );
}
