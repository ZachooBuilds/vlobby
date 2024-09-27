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
import ServiceLocationUpsertForm from "../_forms/upsert-service-locations";
import useModalStore from "../../../../lib/global-state/modal-state";

// Row Data Interface
export interface ServiceLocation {
  _id: string;
  name: string;
  description: string;
}

interface ServiceLocationTableProps {
  data: ServiceLocation[];
}

// DataGrid component
const ServiceLocationsTable = ({ data }: ServiceLocationTableProps) => {
  console.log(data);
  // Access the openSheet function from the global sheet store
  const openModal = useModalStore((state) => state.openModal);

  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState<ColDef<ServiceLocation>[]>([
    {
      field: "name",
      headerName: "Location",
      flex: 1,
      cellRenderer: (params: { value: string }) => {
        return <Badge size={"xs"}>{params.value}</Badge>;
      },
    },
    { field: "description", headerName: "Description", flex: 1 },
  ]);

  const gridOptions: GridOptions = {
    // Handle row click event
    onRowClicked: (event: RowClickedEvent<ServiceLocation>) => {
      const serviceLocationData: ServiceLocation = event.data!;
      openModal(
        "Service Location Details",
        "Use the options below to edit an existing service location.",
        <ServiceLocationUpsertForm
          selectedServiceLocation={{
            _id: serviceLocationData._id,
            description: serviceLocationData.description,
            name: serviceLocationData.name,
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

export default ServiceLocationsTable;
