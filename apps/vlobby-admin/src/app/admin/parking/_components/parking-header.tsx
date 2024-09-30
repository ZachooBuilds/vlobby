"use client";

import { ParkIconPath } from "../../../lib/icons/icons";

export default function ParkingHeader() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 p-2">
      <div className="flex w-full flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-4">
            <svg
              className="h-5 w-5 fill-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
            >
              {ParkIconPath()}
            </svg>
            <p className="text-lg text-foreground">Parking</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Use this page to manage parking spaces and access control.
          </p>
        </div>
      </div>
    </div>
  );
}
