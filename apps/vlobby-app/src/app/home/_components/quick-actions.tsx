import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/components/ui/button';
import {
  CarIconPath,
  CommunicationIconPath,
  FeedIconPath,
  IssueIconPath,
} from '../../../../public/svg/icons';

const QuickActions = () => {
  const router = useRouter();

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
        <Button
          key={index}
          variant="outline"
          onClick={() => router.push(action.path)}
          className="flex-shrink-0"
        >
          <div className="flex flex-row gap-2 items-center justify-center">
            <div className="flex fill-primary w-4 h-4 items-center justify-center">
              {action.icon}
            </div>
            <span className="text-sm">{action.label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
