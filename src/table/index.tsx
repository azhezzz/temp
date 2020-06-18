import React from 'react';
import MUIDataTable, { MUIDataTableProps, MUIDataTableColumn } from 'mui-datatables';
import _ from 'lodash';
import { Toolbar } from './Toolbar';
import dayjs from 'dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import styles from './styles.less';
import { Select } from '../Select';
import { ErrorBoundaryWrap } from '../ErrorBoundary/';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import classnames from 'classnames';

interface IProps extends MUIDataTableProps {
  columns: ({
    options?: { customFilterListOptions?: any; downloadRender?: (data: any) => string };
    dateType?: any[];
    isDateFilter?: boolean;
  } & MUIDataTableColumn)[];
  csvFileName?: string;
  isSelectableRowsOnClick?: boolean;
}
interface IState {
  sort: { column: string; direction: 'desc' | 'asc' | 'none' };
  filters: any[];
  dateTypeValue: string;
  dateTypeOptions: any[];
  date: { from: number; to: number };
  searchText: string | null;
}

@ErrorBoundaryWrap()
export default class Example extends React.PureComponent<IProps, IState> {
  dateRef: React.RefObject<any>;
  constructor(props: IProps) {
    super(props);
    this.dateRef = React.createRef();
    this.state = {
      sort: { column: '', direction: 'none' },
      filters: [],
      dateTypeValue: '',
      dateTypeOptions: [],
      date: { from: 0, to: 0 },
      searchText: null,
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
  onFilterChange = (changedColumn: string, filters: any[]) => {
    const { dateTypeValue } = this.state;
    console.log(changedColumn, filters);
    if (changedColumn === dateTypeValue) {
      this.setState({ date: { from: 0, to: 0 } });
      this.dateRef.current && this.dateRef.current.resetDate();
    }
    this.setState({ filters });
  };

  handleDateChange = (fromDate: number, toDate: number) => {
    this.setState({
      date: {
        from: dayjs(fromDate).startOf('day').unix() || 0,
        to: dayjs(toDate).endOf('day').unix() || 0,
      },
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
  onSearchChange = (searchText: string) => {
    this.setState({ searchText });
  };
  initState = () => {
    const { columns } = this.props;
    let dateTypeOptions: any[] = [];
    let dateTypeValue = '';
    const sort = { column: '', direction: 'none' as 'none' };
    const filters: any[] = [];
    const date = { from: 0, to: 0 };
    const searchText = null;
    columns.forEach((item) => {
      if (item.isDateFilter) {
        dateTypeValue = item.name;
      }
      if (item.dateType) {
        dateTypeOptions = item.dateType.map((it: any) => ({
          text: it.label,
          value: it.name,
        }));
        dateTypeValue = item.name;
      }
    });
    this.setState({
      dateTypeValue,
      dateTypeOptions,
      sort,
      filters,
      date,
      searchText,
    });
  };
  componentDidMount() {
    this.initState();
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.title !== this.props.title) {
      this.initState();
    }
  }

  downloadOptions = (csvFileName: string) => ({
    filename: csvFileName,
    separator: ',',
    filterOptions: {
      useDisplayedColumnsOnly: true,
      useDisplayedRowsOnly: true,
    },
  });

  onDownload = (buildHead: (columns: any) => string, buildBody: (data: any) => string, columns: any, data: any) => {
    const newData = _.map(data, (rowItem) => {
      return {
        data: _.map(rowItem.data, (columnItem, columnIndex) => {
          const downloadRender = columns[columnIndex] && columns[columnIndex].downloadRender;
          if (downloadRender) {
            return downloadRender(columnItem);
          }
          return columnItem;
        }),
      };
    });
    console.log(columns);
    const CSVHead = buildHead(columns);
    const CSVBody = buildBody(newData);
    return `${CSVHead}${CSVBody}`.trim();
  };

  render() {
    const { sort, filters, dateTypeValue, dateTypeOptions, date, searchText } = this.state;
    const { options = {}, columns, title, data, csvFileName = '', isSelectableRowsOnClick = true } = this.props;
    const dateFilterList = _.compact(Object.values(date)).length === 2 ? Object.values(date) : [];
    const defaultOptions = {
      onColumnSortChange: this.onColumnSortChange,
      onFilterChange: this.onFilterChange,
      customToolbar: this.buildCustomToolBar,
      onSearchChange: this.onSearchChange,
      elevation: 0,
      disableToolbarSelect: true,
      print: false,
      searchText,
      downloadOptions: this.downloadOptions(csvFileName),
      onDownload: this.onDownload,
      selectableRowsHeader: Boolean(data.length),
      fixedHeaderOptions: { xAxis: false, yAxis: true },
      selectableRowsOnClick: (options.selectableRows !== 'none' && isSelectableRowsOnClick) || options.onRowClick,
    };
    const customizeOptions = { ...defaultOptions, ...options };
    const customizeColumns = _.cloneDeep(columns).map((item, index) => {
      item.options = item.options || {};
      if (item.name === sort.column) {
        item.options.sortDirection = sort.direction;
      }
      if (filters[index] && (filters[index] as string[]).length) {
        console.log(item);

        item.options.filterList = filters[index];

        item.options.customFilterListOptions = { update: cancelFilter };
      }

      if (item.dateType) {
        item.name = dateTypeValue || item.name;
        item.label = _.get(_.find(dateTypeOptions, ['value', dateTypeValue]), 'text', item.label);
      }

      if (item.isDateFilter) {
        item.options.filter = true;
        item.options.filterType = 'custom';

        item.options.filterList = (dateFilterList as unknown) as string[];
        item.options.filterOptions = { logic: dateColumnFilterOptionsLogic };

        item.options.customFilterListOptions = {
          render: dateColumnCustomFilterListOptionsRender,
          update: cancelFilter,
        };
      }
      return item;
    });

    return (
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <div className={classnames(styles.customTable)}>
          <MuiThemeProvider theme={CustomMuiTheme}>
            <MUIDataTable
              title={title}
              data={data}
              columns={customizeColumns as any}
              options={customizeOptions as any}
            />
          </MuiThemeProvider>
        </div>
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
  console.log('customFilterListOnDelete: ', filterList, filterPos, index);
  return filterList;
}

function dateColumnCustomFilterListOptionsRender(v: any) {
  return `From: ${dayjs.unix(v[0]).format('YYYY/MM/DD')},  To: ${dayjs.unix(v[1]).format('YYYY/MM/DD')}`;
}
function dateColumnFilterOptionsLogic(dateFormatter: string, filters: number[]) {
  const fromDate = filters[0];
  const toDate = filters[1];
  if (!fromDate || !toDate) return false;
  const date = dayjs(dateFormatter).unix();
  console.log(fromDate, toDate, date, dateFormatter);
  return date < fromDate || date > toDate || !date;
}

const CustomMuiTheme = (() =>
  createMuiTheme({
    palette: { primary: { main: '#67b1f6' } },
    overrides: {
      MuiIconButton: { root: { color: 'inherit' } },
      MUIDataTable: {
        paper: {
          backgroundColor: 'var(--surfaceL1)',
          color: 'var(--surfaceHighEmphasis)',
          boxShadow: 'none',
          borderRadius: 0,
        },
      },
      // thead
      MUIDataTableHeadRow: { root: { backgroundColor: 'transparent' } },
      MUIDataTableHeadCell: {
        fixedHeaderCommon: { backgroundColor: 'transparent' },
        sortAction: { alignItems: 'center' },
        sortActive: { color: 'inherit' },
      },
      // tbody
      MuiTableCell: {
        body: { color: 'var(--surfaceHighEmphasis)' },
        head: { color: 'var(--surfaceHighEmphasis)' },
        root: {
          borderBottomColor: 'var(--backgroundMidEmphashisAlt)',
        },
      },
      // sorter
      MuiTableSortLabel: {
        icon: { color: 'var(--surfaceHighEmphasis) !important' },
      },
      //checkbox
      MuiCheckbox: { root: { color: 'var(--backgroundMidEmphashisAlt)' } },
      MUIDataTableSelectCell: {
        headerCell: { backgroundColor: 'transparent' },
        fixedHeaderCommon: { backgroundColor: 'transparent' },
      },
      // toolbar
      MUIDataTableToolbar: {
        icon: { color: 'var(--backgroundHighEmphasis)' },
        actions: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
      },
      MuiPaper: {
        root: {
          color: 'var(--surfaceHighEmphasis)',
          backgroundColor: 'var(--surfaceL1)',
        },
      },
      MuiInputBase: { input: { color: 'var(--surfaceHighEmphasis)' } },
      MuiFormLabel: { root: { color: 'var(--surfaceHighEmphasis)' } },
      MUIDataTableFilter: {
        root: { backgroundColor: 'var(--surfaceL1)' },
        title: { color: 'white' },
      },
      MUIDataTableViewCol: {
        label: { color: 'var(--surfaceHighEmphasis)' },
        title: { color: 'white' },
      },
      // footer
      MUIDataTablePagination: {
        root: { borderBottom: 'none', color: 'var(--backgroundHighEmphasis)' },
      },
      MuiTablePagination: {
        selectIcon: { color: 'var(--backgroundHighEmphasis)' },
      },
      // date picker
      MuiPickersCalendarHeader: { iconButton: { backgroundColor: 'inherit' } },
    },
  } as any))();
