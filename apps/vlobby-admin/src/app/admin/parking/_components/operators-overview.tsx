'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';

import OperatorUpsertForm from '../_forms/upsert-operator';

import { Badge } from '@tremor/react';
import { PencilIcon, Loader2 } from 'lucide-react';
import { Operator } from '../_forms/operator-validation';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { api } from '@repo/backend/convex/_generated/api';
import useModalStore from '../../../lib/global-state/modal-state';
import { Input } from '@repo/ui/components/ui/input';
import NoData from '../../_components/global-components/no-data';

const OperatorSummaryCard = ({
  operator,
  onEdit,
}: {
  operator: Operator;
  onEdit: (operator: Operator) => void;
}) => (
  <Card className="w-full" key={operator._id}>
    <CardContent className="flex flex-row justify-between pt-4">
      <div className="flex flex-col items-start justify-start gap-2">
        <Badge>{operator.email}</Badge>
        <div>
          <p className="font-medium">
            {operator.firstName} {operator.lastName}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onEdit(operator)}>
        <PencilIcon className="h-4 w-4 text-muted-foreground" />
      </Button>
    </CardContent>
  </Card>
);

const OperatorsOverview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const operators = useQuery(api.parkingOperators.getAll);

  const openModal = useModalStore((state) => state.openModal);

  const handleAddOperator = () => {
    openModal(
      'Add New Operator',
      'Enter the details of the new operator',
      <OperatorUpsertForm />
    );
  };

  const handleEditOperator = (operator: Operator) => {
    openModal(
      'Edit Operator',
      'Update the details of the operator',
      <OperatorUpsertForm selectedOperator={operator} />
    );
  };

  const filteredOperators = operators?.filter(
    (operator: Operator) =>
      operator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  ) as Operator[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[40%] rounded-lg border"
        />
        <Button variant="secondary" onClick={handleAddOperator}>
          Add Operator
        </Button>
      </div>
      <div className="h-full w-full">
        {operators === undefined ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOperators.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center pt-10">
            <NoData
              badgeText="No Operators"
              title="No operators found"
              description="There are no operators matching your search criteria. Try adjusting your search or add a new operator."
              buttonText="Add Operator"
              formComponent={<OperatorUpsertForm />}
              sheetTitle="Add New Operator"
              sheetDescription="Enter the details of the new operator"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredOperators.map((operator) => (
              <OperatorSummaryCard
                key={operator._id}
                operator={operator}
                onEdit={handleEditOperator}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorsOverview;
