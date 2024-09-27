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
import { Badge } from "@tremor/react";
import { UpsertTicketTypeForm } from "../_forms/upsert-ticket-types";
import useModalStore from "../../../../lib/global-state/modal-state";
import { Id } from "@repo/backend/convex/_generated/dataModel";

// Row Data Interface
export interface TicketType {
  _id: string;
  name: string;
  description: string;
}

interface TicketTypesTableProps {
  data: TicketType[];
}

// DataGrid component
const TicketTypesTable = ({ data }: TicketTypesTableProps) => {
  console.log(data);
  // Access the openSheet function from the global sheet store
  const openModal = useModalStore((state) => state.openModal);

  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState<ColDef<TicketType>[]>([
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
    onRowClicked: (event: RowClickedEvent<TicketType>) => {
      const ticketTypeData: TicketType = event.data!;
      openModal(
        "Ticket Type Details",
        "Use the options below to edit an existing ticket type.",
        <UpsertTicketTypeForm
          selectedticketType={{
            _id: ticketTypeData._id as Id<"ticketTypes">,
            description: ticketTypeData.description,
            name: ticketTypeData.name,
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

export default TicketTypesTable;
