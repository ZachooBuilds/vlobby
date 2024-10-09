import React from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import {
  CarIconPath,
  CommunicationIconPath,
  FeedIconPath,
  IssueIconPath,
} from '../../../../public/svg/icons';

const QuickActions = () => {
  const actions = [
    { icon: <CarIconPath />, label: 'Request Car', path: '/vehicles' },
    {
      icon: <IssueIconPath />,
      label: 'Log Issue',
      path: '/maintenance/new-issue',
    },
    { icon: <FeedIconPath />, label: 'New Post', path: '/social/new-post' },
    { icon: <CommunicationIconPath />, label: 'Chat', path: '/messages' },
  ];

  return (
    <div className="flex w-full flex-row gap-4 overflow-x-auto">
      {actions.map((action, index) => (
        <Link key={index} href={action.path} passHref>
          <Button variant="outline" className="flex-shrink-0">
            <div className="flex flex-row gap-2 items-center justify-center p-2">
              <div className="flex fill-primary w-4 h-4 items-center justify-center">
                {action.icon}
              </div>
              <span className="text-sm">{action.label}</span>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
