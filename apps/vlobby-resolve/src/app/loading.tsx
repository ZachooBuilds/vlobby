import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium animate-pulse">
        Fetching account data...
      </p>
    </div>
  );
}
