"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Wifi,
  Battery,
  Lock,
  Unlock,
  RectangleEllipsis,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@tremor/react";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";

interface SmartLockProps {
  deviceId: string;
}

const SmartLock = ({ deviceId }: SmartLockProps) => {
  const [isLocked, setIsLocked] = useState(true);

  // TODO: Fetch device details using deviceId
  const deviceDetails = {
    name: "Front Door Lock",
    model: "ALTRO Model XL",
    wifiStatus: "Connected",
    batteryLevel: 76,
  };

  const handleLock = () => {
    // TODO: Implement actual locking logic
    setIsLocked(true);
    console.log("Locking device:", deviceId);
  };

  const handleUnlock = () => {
    // TODO: Implement actual unlocking logic
    setIsLocked(false);
    console.log("Unlocking device:", deviceId);
  };

  return (
    <Card className="h-full w-full max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge
            size="xs"
          >
            <Wifi className="h-3 w-3" />
            {deviceDetails.wifiStatus}
          </Badge>
          <Badge
            size="xs"
            color="green"
          >
            <Battery className="h-3 w-3" />
            {deviceDetails.batteryLevel}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <CardTitle className="text-md font-medium">
            {deviceDetails.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{deviceDetails.model}</p>
        </div>
        <div className="flex justify-center">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={
                "https://utfs.io/f/7c385290-0f9e-486b-a61e-1ae97d2bd8b5-9w6i5v.webp"
              }
              alt={"img"}
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <div className="flex justify-start gap-4">
          <Button size="sm" variant="secondary">
            <RectangleEllipsis className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Tabs
          defaultValue={isLocked ? "locked" : "unlocked"}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked" onClick={handleUnlock}>
              <Unlock className="mr-2 h-4 w-4" />
              Unlock
            </TabsTrigger>
            <TabsTrigger value="locked" onClick={handleLock}>
              <Lock className="mr-2 h-4 w-4" />
              Lock
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex justify-center">
          <Badge color={isLocked ? "red" : "green"}>
            Status: {isLocked ? "Locked" : "Unlocked"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartLock;
