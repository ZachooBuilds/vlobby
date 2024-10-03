import { Badge } from '@tremor/react';
import { EnhancedIssue, Issue } from '../../../lib/app-types';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui/card';
import { colorsList } from '../../../lib/staticData';

interface IssueSummaryCardProps {
  issue: EnhancedIssue;
  onSelect: () => void;
}

export default function IssueSummaryCard({
  issue,
  onSelect,
}: IssueSummaryCardProps) {
  const priorityColor =
    issue.priority.toLowerCase() === 'high'
      ? 'red'
      : issue.priority.toLowerCase() === 'medium'
        ? 'orange'
        : 'green';

  return (
    <Card className="w-full p-4 cursor-pointer" onClick={onSelect}>
      <CardHeader className="flex flex-col items-start justify-between p-0">
        <div className="flex flex-row gap-2">
          <Badge size="xs">
            {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}
          </Badge>
          <Badge
            className="flex flex-row gap-1"
            size="xs"
            color={priorityColor}
          >
            {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
          </Badge>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <CardTitle className="text-md font-semibold">{issue.title}</CardTitle>
          <Badge size="sm">{issue.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-xs text-gray-500">
          Logged: {format(new Date(issue._creationTime), 'MMM d, yyyy HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}
