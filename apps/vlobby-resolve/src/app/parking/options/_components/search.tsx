'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';
import { CarIconPath } from '../../../../../public/svg/icons';
import { Search } from 'lucide-react';

export default function VehicleSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for vehicle:', searchQuery);
    // Implement actual search logic here in the future
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 fill-foreground">
            <CarIconPath />
          </div>
          Request Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder="Enter vehicle details"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
