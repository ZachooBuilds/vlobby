"use client";
/**
 * @file ParcelsTable Component
 * @description This component provides a table view for displaying and managing parcel data.
 * It uses ag-Grid for table functionality and includes features like CSV export and filtering.
 */
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
import ParcelUpsertForm from "../_forms/parcel-upsert-form";
import { ParcelTableData } from "../../../lib/app-data/app-types";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Button } from "@repo/ui/components/ui/button";

/**
 * @interface ParcelTableEntry
 * @description Defines the structure of a parcel entry in the table
 */
export interface ParcelTableEntry {
  _id: string;
  spaceName: string;
  occupantName: string;
  parcelTypeName: string;
  numPackages: number;
  description?: string;
  location: string;
  isCollected: boolean;
}

/**
 * @interface ParcelsTableProps
 * @description Defines the props for the ParcelsTable component
 */
interface ParcelsTableProps {
  data: ParcelTableData[];
}

/**
 * @function ParcelsTable
 * @description The main component for displaying and managing parcel data
 * @param {ParcelsTableProps} props - The component props
 * @returns {JSX.Element} The rendered ParcelsTable component
 */
const ParcelsTable = ({ data }: ParcelsTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const openSheet = useSheetStore((state) => state.openSheet);

  /**
   * @constant colDefs
   * @description Defines the column structure for the ag-Grid table
   */
  const [colDefs] = useState<ColDef<ParcelTableEntry>[]>([
    {
      field: "spaceName",
      headerName: "Space",
      flex: 1,
    },
    {
      field: "occupantName",
      headerName: "Occupant",
      flex: 1,
    },
    {
      field: "parcelTypeName",
      headerName: "Parcel Type",
      flex: 1,
    },
    {
      field: "numPackages",
      headerName: "Number of Packages",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "isCollected",
      headerName: "Collected",
      flex: 1,
      cellRenderer: (params: { value: boolean }) => {
        return (
          <Badge color={params.value ? "green" : "red"}>
            {params.value ? "Yes" : "No"}
          </Badge>
        );
      },
    },
  ]);

  /**
   * @function onGridReady
   * @description Callback function when the grid is ready
   * @param {GridReadyEvent} params - The grid ready event parameters
   */
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  /**
   * @constant gridOptions
   * @description Defines the options for the ag-Grid component
   */
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
    onRowClicked: (selectedRowData: RowClickedEvent<ParcelTableEntry>) => {
      const selectedParcel = data.find(
        (parcel) => parcel._id === selectedRowData.data!._id,
      );
      if (selectedParcel) {
        openSheet(
          "Update Parcel Details",
          "Use the form below to update an existing parcel's details or delete the parcel from the danger zone below. Make sure to click save!",
          <ParcelUpsertForm selectedParcel={selectedParcel} />,
        );
        gridRef.current?.api.deselectAll();
      }
    },
    rowSelection: "single",
  };

  /**
   * @function onBtnExport
   * @description Function to export grid data as CSV
   */
  const onBtnExport = () => {
    gridRef.current?.api?.exportDataAsCsv();
  };

  /**
   * @function clearFilters
   * @description Function to clear all applied filters in the grid
   */
  const clearFilters = () => {
    gridRef.current?.api?.setFilterModel(null);
  };

  return (
    <div
      className="ag-theme-quartz-dark flex flex-col gap-2"
      style={{ width: "100%" }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 pl-1">
          <p className="text-base font-medium text-foreground">
            All Parcels
          </p>
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

export default ParcelsTable;
