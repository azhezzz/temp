import React, { useState, useCallback } from 'react';
import { columns, data } from './colConfig';
import MUIDataTable from './table';
import { Button, Box } from '@material-ui/core';

export default function () {
  const [rowsSelected, setRowsSelected] = useState<any[]>([]);
  const onRowsSelect = useCallback((rowsSelected: any, allRows: any[]) => {
    console.log(rowsSelected, allRows);
    const list = allRows.map((row: { dataIndex: any }) => row.dataIndex);
    setRowsSelected(list);
  }, []);
  const options = {
    filter: true,
    selectableRows: 'none',
    selectableRowsOnClick: true,
    filterType: 'dropdown',
    responsive: 'stacked',
    rowsPerPage: 10,
    rowsSelected: rowsSelected,
    onRowsSelect,
    selectableRowsHeader: true,
  };

  const handleCancelAllCheck = () => setRowsSelected([]);

  return (
    <div>
      <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options as any} />
      <Box mt={2}>
        <Button onClick={handleCancelAllCheck} variant="contained">
          Cancel ALL Check
        </Button>
      </Box>
    </div>
  );
}
