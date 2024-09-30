"use client";
/**
 * @file ContractorsTable Component
 * @description This component provides a table view for displaying and managing contractor data.
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
import { ContractorFormData } from "../_forms/contractor-validation";
import ContractorUpsertForm from "../_forms/contractor-upsert-form";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Button } from "@repo/ui/components/ui/button";

/**
 * @interface ContractorTableEntry
 * @description Defines the structure of a contractor entry in the table
 */
export interface ContractorTableEntry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phone: string;
  serviceCategories: string[];
}

/**
 * @interface ContractorsTableProps
 * @description Defines the props for the ContractorsTable component
 */
interface ContractorsTableProps {
  data: ContractorFormData[];
}

/**
 * @function ContractorsTable
 * @description The main component for displaying and managing contractor data
 * @param {ContractorsTableProps} props - The component props
 * @returns {JSX.Element} The rendered ContractorsTable component
 */
const ContractorsTable = ({ data }: ContractorsTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const openSheet = useSheetStore((state) => state.openSheet);

  // Format data for table display
  const formattedData = data.map((contractor) => ({
    ...contractor,
    serviceCategories: contractor.preferredServiceCategories.map(
      (serviceCategory) => serviceCategory.label,
    ),
  }));

  /**
   * @constant colDefs
   * @description Defines the column structure for the ag-Grid table
   */
  const [colDefs] = useState<ColDef<ContractorTableEntry>[]>([
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
    {
      field: "email",
      headerName: "Email",
      flex: 2,
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "serviceCategories",
      headerName: "Service Categories",
      flex: 2,
      cellRenderer: (params: { value: string[] }) => (
        <div className="flex flex-wrap gap-1">
          {params.value.map((category, index) => (
            <Badge key={index} size={"xs"}>
              {category}
            </Badge>
          ))}
        </div>
      ),
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
    rowData: formattedData,
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
    onRowClicked: (selectedRowData: RowClickedEvent<ContractorTableEntry>) => {
      const selectedContractor = data.find(
        (contractor) => contractor._id === selectedRowData.data!._id,
      );
      if (selectedContractor) {
        openSheet(
          "Update Contractor Details",
          "Use the form below to update an existing contractor's details or delete the contractor from the danger zone below. Make sure to click save!",
          <ContractorUpsertForm selectedContractor={selectedContractor} />,
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
            All Approved Contractors
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

export default ContractorsTable;
