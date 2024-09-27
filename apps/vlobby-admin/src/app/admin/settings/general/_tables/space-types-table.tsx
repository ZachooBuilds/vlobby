"use client";
import { AgGridReact } from "ag-grid-react";
import React, { useRef, useState, useMemo } from "react";
import {
  RowClickedEvent,
  type ColDef,
  type GridOptions,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import SpaceTypeUpsertForm from "../_forms/upsert-space-types";
import { Badge } from "@tremor/react";
import useModalStore from "../../../../lib/global-state/modal-state";
import { Id } from "@repo/backend/convex/_generated/dataModel";

// Row Data Interface
export interface SpaceType {
  _id: string;
  name: string;
  description: string;
}

interface SpaceTypesTableProps {
  data: SpaceType[];
}

// DataGrid component
const SpaceTypesTable = ({ data }: SpaceTypesTableProps) => {
  console.log(data);
  // Access the openSheet function from the global sheet store
  const openModal = useModalStore((state) => state.openModal);

  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState<ColDef<SpaceType>[]>([
    {
      field: "name",
      headerName: "Type",
      flex: 1,
      cellRenderer: (params: { value: string }) => {
        return <Badge size={"xs"}>{params.value}</Badge>;
      },
    },
    { field: "description", headerName: "Description", flex: 1 },
  ]);

  const gridOptions: GridOptions = {
    // Handle row click event
    onRowClicked: (event: RowClickedEvent<SpaceType>) => {
      const spaceTypeData: SpaceType = event.data!;
      openModal(
        "Space Type Details",
        "Use the options below to edit an existing space type.",
        <SpaceTypeUpsertForm
          selectedSpaceType={{
            description: spaceTypeData.description,
            name: spaceTypeData.name,
            id: spaceTypeData._id as Id<"spaceTypes">,
          }}
        />,
      );
      gridRef.current?.api.deselectAll();
    },
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
    rowSelection: "single",
  };

  // Ref to access the grid API
  const gridRef = useRef<AgGridReact>(null);

  return (
    <div
      className="ag-theme-quartz-dark flex flex-col"
      style={{ width: "100%", height: "100%" }}
    >
      <div className="flex-grow">
        <AgGridReact {...gridOptions} ref={gridRef} />
      </div>
    </div>
  );
};

export default SpaceTypesTable;
