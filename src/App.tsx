import React, { useState, useCallback } from "react";
import { columns, data } from "./colConfig";
import MUIDataTable from "./table";

export default function() {
  const [rowsSelected, setRowsSelected] = useState<any[]>([]);
  const onRowsSelect = useCallback((rowsSelected: any, allRows: any[]) => {
    console.log(rowsSelected, allRows);
    const list = allRows.map((row: { dataIndex: any }) => row.dataIndex);
    setRowsSelected(list);
  }, []);
  const options = {
    filter: true,
    selectableRows: "multiple",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    responsive: "stacked",
    rowsPerPage: 10,
    rowsSelected: rowsSelected,
    onRowsSelect,
    selectableRowsHeader: true
  };

  return (
    <MUIDataTable
      title={"ACME Employee list"}
      data={data}
      columns={columns}
      options={options as any}
    />
  );
}
