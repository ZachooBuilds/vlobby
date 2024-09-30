"use client";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  GridReadyEvent,
  RowClickedEvent,
  type ColDef,
  type GridOptions,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Badge } from "@tremor/react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { IssueFormDataWithNames } from "../../../lib/app-data/app-types";
import { colorsList } from "../../../lib/app-data/static-data";
import { Button } from "@repo/ui/components/ui/button";

// Row Data Interface
interface IssuesTableEntry {
  _id: string;
  tags: string[];
  linkedAssetName: string;
  locationName: string;
  floor: string;
  issueType: string;
  buildingName: string;
  priority: string;
  assignedTo: string;
  followUpDate: string;
  _creationTime: string;
}

interface IssuesTableProps {
  data: IssueFormDataWithNames[];
}

// DataGrid component
const IssuesTable = ({ data }: IssuesTableProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const router = useRouter();

  //Custom colour loader

  // Create a color mapping for space types
  const typeColorMap = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(data.map((entry) => entry.issueType)),
    );
    return Object.fromEntries(
      uniqueTypes.map((type, index) => [
        type,
        colorsList[index % colorsList.length]?.hex ?? "#000000",
      ]),
    );
  }, [data]);

  // Format data for table display
  const formattedData = data.map((issue) => ({
    ...issue,
    tags: issue.tags.map((tag) => tag.label),
  }));

  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState<ColDef<IssuesTableEntry>[]>([
    {
      field: "tags",
      headerName: "Tags",
      cellRenderer: (params: { value: string[] }) => (
        <div className="flex flex-row gap-1">
          {params.value.map((category, index) => (
            <Badge key={index} size="xs">
              {category}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      field: "linkedAssetName",
      headerName: "Linked Asset",
      cellRenderer: (params: { value: string | null }) =>
        params.value ? (
          <span>{params.value}</span>
        ) : (
          <Badge color={"red"} size="xs">
            Not Linked
          </Badge>
        ),
    },
    {
      field: "issueType",
      headerName: "Issue Type",
      cellRenderer: (params: { value: string }) => (
        <div className="flex flex-row items-center gap-2">
          <Badge
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
    { field: "floor", headerName: "Floor" },
    { field: "priority", headerName: "Priority" },
    {
      field: "followUpDate",
      headerName: "Follow Up Date",
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = parseISO(params.value as string);
        return format(date, "dd/MM/yyyy h:mm a");
      },
    },
    {
      field: "_creationTime",
      headerName: "Creation Time",
      valueFormatter: (params) => {
        const date = new Date(params.value as string);
        return format(date, "dd/MM/yyyy h:mm a");
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
    rowData: formattedData,
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
    onRowClicked: (selectedRowData: RowClickedEvent<IssuesTableEntry>) => {
      const issueId = selectedRowData.data!._id;
      router.push(`issues/${issueId}`);
      gridRef.current?.api.deselectAll();
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
          <p className="text-base font-medium text-foreground">All Issues</p>
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

export default IssuesTable;
