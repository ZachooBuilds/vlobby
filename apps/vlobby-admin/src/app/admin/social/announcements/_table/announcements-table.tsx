"use client";
import { AgGridReact } from "ag-grid-react";
import React, { useRef, useState } from "react";
import {
  RowClickedEvent,
  type ColDef,
  type GridOptions,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AnnouncementForm from "../_forms/announcement-form";
import { Badge } from "@tremor/react";
import { AnnouncementFormData } from "../_forms/announcement-validation";
import { AnnouncementTableEntry } from "../../../../lib/app-data/app-types";
import useSheetStore from "../../../../lib/global-state/sheet-state";
import { Button } from "@repo/ui/components/ui/button";

interface AnnouncementTableProps {
  data: AnnouncementTableEntry[];
}

/**
 * AnnouncementTable Component
 *
 * This component renders a data grid for displaying and managing announcements.
 * It uses AG Grid for efficient data rendering and provides features like sorting,
 * filtering, and exporting data.
 *
 * @param {AnnouncementTableProps} props - The component props
 * @param {AnnouncementTableEntry[]} props.data - The array of announcement data to display
 *
 * Usage:
 * <AnnouncementTable data={announcementData} />
 */
const AnnouncementTable = ({ data }: AnnouncementTableProps) => {
  const openSheet = useSheetStore((state) => state.openSheet);
  // Define and configure grid columns
  const [colDefs] = useState<ColDef<AnnouncementTableEntry>[]>([
    { field: "title", headerName: "Title", flex: 1 },
    { field: "dateTime", headerName: "Scheduled", flex: 1 },
    {
      field: "scheduleSend",
      headerName: "Schedule",
      flex: 1,
      cellRenderer: (params: { value: boolean }) => (
        <Badge color={params.value ? "green" : "red"} size={"xs"}>
          {params.value ? "True" : "False"}
        </Badge>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      maxWidth: 150,
      cellRenderer: (params: { value: string }) => (
        <div className="flex w-full flex-row items-center justify-start">
          <Badge size={"xs"}>{params.value}</Badge>
        </div>
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
    },
    onRowClicked: (event: RowClickedEvent<AnnouncementTableEntry>) => {
      const announcementData: AnnouncementFormData =
        event.data as AnnouncementFormData;
      openSheet(
        "Edit Announcment",
        "Use the options below to edit an exisiting role configure permissions and access to device groups.",
        <AnnouncementForm selectedAnnouncement={announcementData} />,
      );
      gridRef.current?.api.deselectAll();
    },
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
        <div className="flex flex-row items-center gap-2">
          <p className="text-base font-medium text-foreground">
            All Announcements
          </p>
          <Badge color={"blue"}>
            {data.filter(announcement => announcement.dateTime && new Date(announcement.dateTime) > new Date()).length > 0
              ? `${data.filter(announcement => announcement.dateTime && new Date(announcement.dateTime) > new Date()).length} scheduled`
              : "None scheduled"}
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

export default AnnouncementTable;
