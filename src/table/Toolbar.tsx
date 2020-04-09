/* eslint-disable no-console */
import React, { useCallback, useState, memo, useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import { InputAdornment } from '@material-ui/core';
import { TextField } from '../TextField';
import { DatePicker } from '@material-ui/pickers';
import DateIcon from '@material-ui/icons/Event';
import styles from './styles.less';
import { CopyToClipboard } from './CopyToClipboard';
const DatePickerTextField = (props: any) => (
  <TextField
    {...props}
    InputProps={{
      error: false,
      endAdornment: (
        <InputAdornment position="end" className={styles.dateIcon}>
          <DateIcon fontSize="small" />
        </InputAdornment>
      ),
    }}
  />
);

const Toolbar = ({ handleDateChange, DateTypeSelect, columns, data }: any, ref: any) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const handleFromDateChange = useCallback((date: any) => {
    setFromDate(date);
  }, []);
  const handleToDateChange = useCallback((date: any) => {
    setToDate(date);
  }, []);
  const resetDate = () => {
    setFromDate(null);
    setToDate(null);
  };
  useEffect(() => {
    handleDateChange(fromDate, toDate);
  }, [fromDate, handleDateChange, toDate]);
  useImperativeHandle(ref, () => ({ resetDate }), []);

  return (
    <>
      <CopyToClipboard data={data} headers={columns} />
      {_.find(columns, ['isDateFilter', true]) && (
        <div className={styles.datePickerContainer}>
          <DatePicker
            label="From"
            format="YYYY/MM/DD"
            autoOk
            clearable={true}
            disableFuture
            value={fromDate}
            onChange={handleFromDateChange}
            TextFieldComponent={DatePickerTextField}
            className={styles.datePicker}
          />
          <DatePicker
            label="To"
            format="YYYY/MM/DD"
            autoOk
            clearable={true}
            disableFuture
            value={toDate}
            onChange={handleToDateChange}
            TextFieldComponent={DatePickerTextField}
            className={styles.datePicker}
          />
        </div>
      )}
      <DateTypeSelect />
    </>
  );
};
const memoComponent = memo(forwardRef(Toolbar));
export { memoComponent as Toolbar };
