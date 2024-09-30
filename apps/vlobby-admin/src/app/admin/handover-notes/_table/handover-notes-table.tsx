"use client";
/**
 * @file HandoverNotesTable Component
 * @description This component provides a table view for displaying and managing handover note data.
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
import HandoverNoteUpsertForm from "../_forms/handover-note-upsert-form";
import { format, parseISO } from "date-fns";
import useSheetStore from "../../../lib/global-state/sheet-state";
import { Button } from "@repo/ui/components/ui/button";

/**
 * @interface HandoverNoteTableEntry
 * @description Defines the structure of a handover note entry in the table
 */
export interface HandoverNoteTableEntry {
  _id: string;
  priority: string;
  title: string;
  description: string;
  followupDate: Date;
  isClosed: boolean;
}

/**
 * @interface HandoverNotesTableProps
 * @description Defines the props for the HandoverNotesTable component
 */
interface HandoverNotesTableProps {
  data: HandoverNoteTableEntry[];
}

/**
 * @function HandoverNotesTable
 * @description The main component for displaying and managing handover note data
 * @param {HandoverNotesTableProps} props - The component props
 * @returns {JSX.Element} The rendered HandoverNotesTable component
 */
const HandoverNotesTable = ({ data }: HandoverNotesTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const openSheet = useSheetStore((state) => state.openSheet);

  /**
   * @constant colDefs
   * @description Defines the column structure for the ag-Grid table
   */
  const [colDefs] = useState<ColDef<HandoverNoteTableEntry>[]>([
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
    },
    {
      field: "followupDate",
      headerName: "Follow-up Date",
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = parseISO(params.value as string);
        return format(date, "dd/MM/yyyy h:mm a");
      },
    },
    {
      field: "isClosed",
      headerName: "Status",
      flex: 1,
      cellRenderer: (params: { value: boolean }) => {
        return (
          <Badge color={params.value ? "green" : "red"}>
            {params.value ? "Closed" : "Open"}
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
    onRowClicked: (
      selectedRowData: RowClickedEvent<HandoverNoteTableEntry>,
    ) => {
      const selectedHandoverNote = data.find(
        (note) => note._id === selectedRowData.data!._id,
      );
      if (selectedHandoverNote) {
        selectedHandoverNote.followupDate = new Date(
          selectedHandoverNote.followupDate,
        );
      }
      if (selectedHandoverNote) {
        openSheet(
          "Update Handover Note",
          "Use the form below to update an existing handover note or delete it from the danger zone below. Make sure to click save!",
          <HandoverNoteUpsertForm
            selectedHandoverNote={selectedHandoverNote}
          />,
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
            All Handover Notes
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

export default HandoverNotesTable;
