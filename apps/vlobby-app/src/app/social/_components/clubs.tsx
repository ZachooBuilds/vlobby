'use client';

import React from 'react';
import UnderConstructionMessage from '../../_components/under-construction';

export default function ClubsOverview() {
  return (
    <div className="flex pt-20 flex-col items-center justify-center gap-4">
      <UnderConstructionMessage
        badgeText="Coming Soon"
        title="Clubs Feature"
        description="We're working on bringing you an exciting new Clubs feature. Stay tuned!"
      />
    </div>
  );
}
