"use client";
/**
 * @file KeyRegisterPage Component
 * @description This component provides the main page for managing key register items.
 * It includes a section header, a table to display key register items, and handles
 * loading and no-data states.
 */
import { useQuery } from "convex/react";
import KeyRegisterUpsertForm from "./_forms/key-upsert-form";
import KeysTable from "./_table/key-register-table";
import OutKeysSummary from "./_components/out-keys-summary";
import KeyLogForm from "./_forms/key-log-form";
import { KeyTableData, OutKeysSummaryData } from "../../lib/app-data/app-types";
import useModalStore from "../../lib/global-state/modal-state";
import { TableSkeleton } from "../_components/skeletons/table-loading-skeleton";
import NoData from "../_components/global-components/no-data";
import { CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { api } from "@repo/backend/convex/_generated/api";
import SectionHeader from "../_components/global-components/section-header";

/**
 * @function KeyRegisterContentLoader
 * @description Handles the display of key register data, including loading and no-data states
 * @param {Object} props - Component props
 * @param {KeyRegisterTableData[]} [props.keyRegisterItems] - Array of key register item data
 * @param {boolean} props.isLoading - Loading state flag
 * @returns {JSX.Element} Rendered component based on data state
 */
function KeyContentLoader({
  allKeys,
  isLoading,
  outKeys,
}: {
  allKeys?: KeyTableData[];
  outKeys?: OutKeysSummaryData[];
  isLoading: boolean;
}) {
  const openModal = useModalStore((state) => state.openModal);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-background p-2">
        <TableSkeleton />
      </div>
    );
  }

  // No data found state
  if (!allKeys || allKeys.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
        <NoData
          badgeText="Where are your keys?"
          title="No Keys Registered"
          description="No keys have been registered yet. Add a new key to get started."
          buttonText="Add Key"
          formComponent={<KeyRegisterUpsertForm />}
          sheetTitle="Add New Key"
          sheetDescription="Enter details to register a new key"
        />
      </div>
    );
  }

  const checkoutKey = () => {
    openModal("Checkout Key", "Checkout a key", <KeyLogForm />);
  };

  // Data found state
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background p-2">
      <CardTitle className="flex w-full items-center justify-between text-sm font-medium">
        Currently Checked Out
        <Button variant="outline" onClick={checkoutKey}>
          Checkout Key
        </Button>
      </CardTitle>

      <OutKeysSummary outKeys={outKeys ?? []} />
      <KeysTable data={allKeys} />
    </div>
  );
}

/**
 * @function KeyRegisterPage
 * @description The main component for the Key Register page
 * @returns {JSX.Element} The rendered KeyRegisterPage component
 */
export default function KeyRegisterPage() {
  // Fetch key register items data using Convex query
  const allKeys = useQuery(api.keys.getAllKeys) as KeyTableData[];

  const outKeys = useQuery(api.keys.getCheckedOutKeys) as OutKeysSummaryData[];

  console.log("Out Keys Data:", outKeys);
  const outKeysWithDateObjects = outKeys?.map((key) => ({
    ...key,
    checkoutTime: new Date(key.checkoutTime),
    checkinTime: key.checkinTime ? new Date(key.checkinTime) : undefined,
  }));

  console.log("Out Keys Data:", outKeysWithDateObjects);

  return (
    <div className="flex h-full flex-col items-start justify-start gap-2 overflow-scroll">
      <SectionHeader
        title="Key Register"
        description="Manage and view all registered keys for your property. You can add new keys, update existing ones, and track their location and status."
        buttonText="Add Key"
        sheetTitle="Add New Key"
        sheetDescription="Enter details to register a new key"
        sheetContent={"KeyUpsertForm"}
        icon="Key"
      />
      <KeyContentLoader
        allKeys={allKeys}
        isLoading={allKeys === undefined}
        outKeys={outKeysWithDateObjects}
      />
    </div>
  );
}
