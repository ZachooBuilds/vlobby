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
import KeyTypeUpsertForm from "../_forms/upsert-key-types";
import { Badge } from "@tremor/react";
import useModalStore from "../../../../lib/global-state/modal-state";
import { Id } from "@repo/backend/convex/_generated/dataModel";

// Row Data Interface
export interface KeyTypeDetails {
  _id: string;
  name: string;
  description: string;
}

interface KeyTypesTableProps {
  data: KeyTypeDetails[];
}

// DataGrid component
const KeyTypesTable = ({ data }: KeyTypesTableProps) => {
  console.log(data);
  // Access the openSheet function from the global sheet store
  const openModal = useModalStore((state) => state.openModal);

  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState<ColDef<KeyTypeDetails>[]>([
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
    onRowClicked: (event: RowClickedEvent<KeyTypeDetails>) => {
      const keyTypeData: KeyTypeDetails = event.data!;
      openModal(
        "Key Type Details",
        "Use the options below to edit an existing key type.",
        <KeyTypeUpsertForm
          selectedKeyType={{
            description: keyTypeData.description,
            name: keyTypeData.name,
            id: keyTypeData._id as Id<"keyTypes">,
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

export default KeyTypesTable;
