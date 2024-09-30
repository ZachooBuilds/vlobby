"use client";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useRef, useState } from "react";
import {
  RowClickedEvent,
  type ColDef,
  type GridOptions,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Badge } from "@tremor/react";
import { format, parseISO } from "date-fns";
import { Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { colorsList } from "../../../lib/app-data/static-data";
import { IconStairs } from '@tabler/icons-react';
import { Button } from "@repo/ui/components/ui/button";

/**
 * Interface representing a single entry in the spaces table
 */
export interface SpacesTableEntry {
  _id: string;
  spaceName: string;
  titleNumber: string;
  type: string;
  description: string;
  building: string;
  floor: string;
  settlementDate: string;
  powerMeterNumber: string;
  waterMeterNumber: string;
  lettingEnabled: boolean;
  accessibilityEnabled: boolean;
  agentName?: string;
  agentBusiness?: string;
  mobile?: string;
  email?: string;
  accessibilityRequirement?: string;
  medicalInfo?: string;
  isOrientationRequired?: boolean;
}

/**
 * Props for the SpacesTable component
 */
interface SpacesTableProps {
  data: SpacesTableEntry[];
}

/**
 * SpacesTable component for displaying and managing space data
 * @param {SpacesTableProps} props - The component props
 * @returns {JSX.Element} The rendered SpacesTable component
 */
const SpacesTable = ({ data }: SpacesTableProps) => {
  const router = useRouter();

  // Create a color mapping for space types
  const typeColorMap = useMemo(() => {
    const uniqueTypes = Array.from(new Set(data.map((entry) => entry.type)));
    return Object.fromEntries(
      uniqueTypes.map((type, index) => [
        type,
        colorsList[index % colorsList.length]?.hex ?? "#000000",
      ]),
    );
  }, [data]);

  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState<ColDef<SpacesTableEntry>[]>([
    { field: "spaceName", headerName: "Space Name" },
    { field: "titleNumber", headerName: "Title Number" },
    {
      field: "type",
      headerName: "Type",
      cellRenderer: (params: { value: string }) => (
        <div className="flex items-center gap-2">
          <Badge
            className="flex flex-row gap-1"
            size="xs"
            style={{
              backgroundColor: `${typeColorMap[params.value]}20`,
              border: `0.5px solid ${typeColorMap[params.value]}`,
              color: typeColorMap[params.value],
            }}
          >
            {params.value}
          </Badge>
        </div>
      ),
    },
    {
      field: "building",
      headerName: "Building",
      cellRenderer: (params: { value: string }) => (
        <div className="flex items-center gap-2">
          <Badge icon={Building} size="xs">
            {params.value}
          </Badge>
        </div>
      ),
    },
    {
      field: "floor",
      headerName: "Floor",
      cellRenderer: (params: { value: string }) => (
        <div className="flex items-center gap-2">
          <Badge icon={IconStairs} size="xs">
            {params.value}
          </Badge>
        </div>
      ),
    },
    {
      field: "settlementDate",
      headerName: "Settled Date",
      filter: "agDateColumnFilter",
      cellRenderer: (params: { value: string }) => {
        const date = parseISO(params.value);
        return format(date, "dd MMM yyyy");
      },
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const cellDate = parseISO(cellValue);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
  ]);

  // Grid Options
  const gridOptions: GridOptions = {
    onRowClicked: (event: RowClickedEvent<SpacesTableEntry>) => {
      const spaceId = event.data!._id;
      router.push(`spaces/${spaceId}`);
      gridRef.current?.api.deselectAll();
    },
    columnDefs: colDefs,
    rowData: data,
    pagination: true,
    rowHeight: 50,
    paginationPageSize: 50,
    domLayout: "autoHeight",
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      editable: false,
    },
    rowSelection: "single",
  };

  // Reference to access the grid API
  const gridRef = useRef<AgGridReact>(null);

  /**
   * Export the current grid data as a CSV file
   */
  const onBtnExport = () => {
    gridRef.current?.api?.exportDataAsCsv();
  };

  /**
   * Clear all applied filters in the grid
   */
  const clearFilters = () => {
    gridRef.current?.api?.setFilterModel(null);
  };

  return (
    <div
      className="ag-theme-quartz-dark flex flex-col gap-2"
      style={{ width: "100%" }}
    >
      {/* Header section with title, badge, and action buttons */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 pl-1">
          <p className="text-base font-medium text-foreground">All Spaces</p>
          <Badge className="rounded-lg border border-blue-600 bg-blue-500 bg-opacity-20 text-blue-600">
            {data.length} Total
          </Badge>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button variant="secondary" onClick={onBtnExport}>
            Export Data
          </Button>
        </div>
      </div>

      {/* AG Grid component */}
      <AgGridReact
        {...gridOptions}
        ref={gridRef}
        className="h-full w-full items-center"
        suppressAutoSize={true}
      />
    </div>
  );
};

export default SpacesTable;
