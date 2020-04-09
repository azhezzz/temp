/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from 'react';
import MUIDataTable, { MUIDataTableProps, MUIDataTableColumn } from 'mui-datatables';
import _ from 'lodash';
import { Toolbar } from './Toolbar';
import dayjs from 'dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import styles from './styles.less';
import { Select } from '../Select';

interface IProps extends MUIDataTableProps {
  columns: MUIDataTableColumn[];
}
interface IState {
  sort: { column: string; direction: 'desc' | 'asc' | '' };
  filters: any[];
  dateTypeValue: string;
  dateTypeOptions: any[];
  date: { from: number; to: number };
}
export default class Example extends React.PureComponent<IProps, IState> {
  dateRef: React.RefObject<any>;
  constructor(props: IProps) {
    super(props);
    this.dateRef = React.createRef();
    this.state = {
      sort: { column: '', direction: '' },
      filters: [],
      dateTypeValue: '',
      dateTypeOptions: [],
      date: { from: 0, to: 0 },
    };
  }
  onColumnSortChange = (column: any, direction: any) => {
    if (direction === 'descending') {
      this.setState({ sort: { column, direction: 'desc' } });
    }
    if (direction === 'ascending') {
      this.setState({ sort: { column, direction: 'asc' } });
    }
  };
  onFilterChange = (column: any, filters: any) => {
    const { dateTypeValue } = this.state;
    if (column === dateTypeValue) {
      this.setState({ date: { from: 0, to: 0 } });
      console.log(this.dateRef);
      this.dateRef && this.dateRef.current && this.dateRef.current.resetDate();
    }
    this.setState({ filters });
  };

  handleDateChange = (fromDate: number, toDate: number) => {
    this.setState({
      date: { from: dayjs(fromDate).startOf('day').unix() || 0, to: dayjs(toDate).endOf('day').unix() || 0 },
    });
  };
  handleDateTypeValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ dateTypeValue: event.target.value as string });
  };
  buildCustomToolBar = () => {
    const { columns, data } = this.props;
    return (
      <Toolbar
        handleDateChange={this.handleDateChange}
        columns={columns}
        data={data}
        DateTypeSelect={this.buildDateTypeSelect()}
        ref={this.dateRef}
      />
    );
  };
  buildDateTypeSelect = () => () => {
    const { dateTypeOptions, dateTypeValue } = this.state;
    if (_.isEmpty(dateTypeOptions)) return null;
    return (
      <div className={styles.dateTypeSelectContainer}>
        <Select
          options={dateTypeOptions}
          value={dateTypeValue}
          onChange={this.handleDateTypeValueChange}
          className={styles.dateTypeSelect}
        />
      </div>
    );
  };

  initDateType = () => {
    const { columns } = this.props;
    let dateTypeOptions: any[] = [];
    let dateTypeValue = '';
    columns.forEach((item) => {
      //@ts-ignore
      if (item.dateType) {
        //@ts-ignore
        dateTypeOptions = item.dateType.map((it: any) => ({ text: it.label, value: it.name }));
        dateTypeValue = item.name;
      }
    });
    this.setState({ dateTypeValue, dateTypeOptions });
  };
  componentDidMount() {
    this.initDateType();
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.title !== this.props.title) {
      this.initDateType();
    }
  }

  render() {
    const { sort, filters, dateTypeValue, dateTypeOptions, date } = this.state;
    const { options, columns, title, data } = this.props;
    const dateFilterList = _.compact(Object.values(date)).length === 2 ? Object.values(date) : [];
    const defaultOptions = {
      onColumnSortChange: this.onColumnSortChange,
      onFilterChange: this.onFilterChange,
      customToolbar: this.buildCustomToolBar,
      elevation: 0,
      disableToolbarSelect: true,
      print: false,
    };
    const customizeOptions = { ...options, ...defaultOptions };
    const customizeColumns = _.cloneDeep(columns).map((item, index) => {
      item.options = item.options || {};
      if (item.name === sort.column) {
        //@ts-ignore
        item.options.sortDirection = sort.direction;
      }
      if (filters[index] && (filters[index] as string[]).length) {
        console.log(item);
        //@ts-ignore
        item.options.filterList = filters[index];
        //@ts-ignore
        item.options.filterType = 'custom';
        //@ts-ignore
        item.options.customFilterListOptions = { update: cancelFilter };
        //@ts-ignore
        // item.options.filterOptions = { display: v => "" };
      }
      //@ts-ignore
      if (item.dateType) {
        item.name = dateTypeValue || item.name;
        item.label = _.get(_.find(dateTypeOptions, ['value', dateTypeValue]), 'text', item.label);
      }
      //@ts-ignore
      if (item.isDateFilter) {
        item.options.filter = true;
        item.options.filterType = 'custom';
        //@ts-ignore
        item.options.filterList = dateFilterList;
        item.options.filterOptions = {
          logic(dateFormatter: string, filters: number[]) {
            const fromDate = filters[0];
            const toDate = filters[1];
            const date = dayjs(dateFormatter).unix();
            if (fromDate && toDate) return date < fromDate || date > toDate || !date;
            return false;
          },
        };
        //@ts-ignore
        item.options.customFilterListOptions = {
          render: (v: any) =>
            `From: ${dayjs.unix(v[0]).format('YYYY/MM/DD')},  To: ${dayjs.unix(v[1]).format('YYYY/MM/DD')}`,
          update: cancelFilter,
        };
      }
      return item;
    });
    return (
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <MUIDataTable title={title} data={data} columns={customizeColumns as any} options={customizeOptions as any} />
      </MuiPickersUtilsProvider>
    );
  }
}

function cancelFilter(filterList: { [x: string]: never[] }, filterPos: number, index: string | number) {
  if (filterPos === 0) {
    filterList[index].splice(filterPos, 1);
  } else if (filterPos === 1) {
    filterList[index].splice(filterPos, 1);
  } else if (filterPos === -1) {
    filterList[index] = [];
  }
  // console.log('customFilterListOnDelete: ', filterList, filterPos, index);

  return filterList;
}
