"use client";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useRef, useState } from "react";
import {
  RowClickedEvent,
  type ColDef,
  type GridOptions,
  type GridReadyEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Badge } from "@tremor/react";
import { useRouter } from "next/navigation";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Button } from "@repo/ui/components/ui/button";

/**
 * Interface representing an entry in the occupants table.
 */
export interface OccupantsTableEntry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  parcelPreference: string;
  userId: string;
}

/**
 * Props for the OccupantsTable component.
 */
interface OccupantsTableProps {
  data: OccupantsTableEntry[];
}

/**
 * OccupantsTable component for displaying and managing occupant data.
 * @param {OccupantsTableProps} props - The component props.
 * @returns {JSX.Element} The rendered OccupantsTable component.
 */
const OccupantsTable = ({ data }: OccupantsTableProps) => {
  const openSheet = useSheetStore((state) => state.openSheet);
  const gridRef = useRef<AgGridReact>(null);
  const router = useRouter();

  // Define column definitions for the ag-grid
  const [colDefs] = useState<ColDef<OccupantsTableEntry>[]>([
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "phoneNumber", headerName: "Phone", flex: 1 },
    {
      field: "parcelPreference",
      headerName: "Parcel Preference",
      flex: 1,
      cellRenderer: (params: { value: string }) => (
        <Badge
          color={
            params.value === "hold"
              ? "blue"
              : params.value === "deliver"
                ? "green"
                : "yellow"
          }
        >
          {params.value}
        </Badge>
      ),
    },
  ]);

  // Configure grid options
  const gridOptions: GridOptions = {
    columnDefs: colDefs,
    rowData: data,
    pagination: true,
    rowHeight: 50,
    paginationPageSize: 50,
    domLayout: "autoHeight",
    defaultColDef: {
      resizable: false,
      sortable: true,
      filter: true,
      flex: 1,
      editable: false,
    },
    onRowClicked: (event: RowClickedEvent<OccupantsTableEntry>) => {
      const occupantId = event.data!._id;
      router.push(`occupants/${occupantId}`);
      gridRef.current?.api.deselectAll();
    },
    rowSelection: "single",
  };

  /**
   * Callback function to handle grid ready event.
   * @param {GridReadyEvent} params - The grid ready event parameters.
   */
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  /**
   * Function to export grid data as CSV.
   */
  const onBtnExport = () => {
    gridRef.current?.api?.exportDataAsCsv();
  };

  /**
   * Function to clear all applied filters in the grid.
   */
  const clearFilters = () => {
    gridRef.current?.api?.setFilterModel(null);
  };

  console.log("data", data);

  return (
    <div
      className="ag-theme-quartz-dark flex flex-col gap-2"
      style={{ width: "100%" }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 pl-1">
          <p className="text-base font-medium text-foreground">All Occupants</p>
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

      <AgGridReact
        {...gridOptions}
        ref={gridRef}
        className="h-full w-full items-center"
        onGridReady={onGridReady}
        suppressAutoSize={true}
      />
    </div>
  );
};

export default OccupantsTable;
