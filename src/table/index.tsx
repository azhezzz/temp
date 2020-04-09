/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from "react";
import MUIDataTable, {
  MUIDataTableProps,
  MUIDataTableColumn
} from "mui-datatables";
import _ from "lodash";
import memoizeOne from "memoize-one";
import { Toolbar } from "./Toolbar";
import dayjs from "dayjs";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";
interface IProps extends MUIDataTableProps {
  columns: MUIDataTableColumn[];
}
interface IState {
  sort: { column: string; direction: "desc" | "asc" | "" };
  filters: any[];
  dateTypeValue: string;
  dateTypeOptions: any[];
  date: { from: number; to: number };
}
export default class Example extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      sort: { column: "", direction: "" },
      filters: [],
      dateTypeValue: "",
      dateTypeOptions: [],
      date: { from: 0, to: 0 }
    };
  }
  onColumnSortChange = (column: any, direction: any) => {
    if (direction === "descending") {
      this.setState({ sort: { column, direction: "desc" } });
    }
    if (direction === "ascending") {
      this.setState({ sort: { column, direction: "asc" } });
    }
  };
  onFilterChange = (column: any, filters: any) => {
    this.setState({ filters });
  };
  handleClipboard = () => {};
  handleDateChange = (fromDate: number, toDate: number) => {
    this.setState({
      date: {
        from:
          dayjs(fromDate)
            .startOf("day")
            .unix() || 0,
        to:
          dayjs(toDate)
            .endOf("day")
            .unix() || 0
      }
    });
  };
  handleDateTypeValueChange = (event: React.ChangeEvent<{ value: string }>) => {
    this.setState({ dateTypeValue: event.target.value });
  };
  buildCustomToolBar = () => {
    const { columns, data } = this.props;
    const { dateTypeValue, dateTypeOptions } = this.state;
    return (
      <Toolbar
        handleClipboard={this.handleClipboard}
        handleDateChange={this.handleDateChange}
        dateType={dateTypeValue}
        dateTypeOptions={dateTypeOptions}
        handleDateTypeValueChange={this.handleDateTypeValueChange}
        columns={columns}
        data={data}
      />
    );
  };

  initDateOptions = memoizeOne((columns: MUIDataTableColumn[]) => {
    const { dateTypeValue } = this.state;
    columns.forEach(item => {
      //@ts-ignore
      if (!_.isEmpty(item.dateType) && !dateTypeValue) {
        //@ts-ignore
        const dateTypeOptions = item.dateType.map((it: any) => ({
          text: it.label,
          value: it.name
        }));
        this.setState({ dateTypeValue: item.name, dateTypeOptions });
      }
    });
  }, _.isEqual);

  render() {
    const { sort, filters, dateTypeValue, dateTypeOptions } = this.state;
    const { options, columns, title, data } = this.props;
    this.initDateOptions(columns);
    const customizeOptions = {
      ...options,
      ...{
        onColumnSortChange: this.onColumnSortChange,
        onFilterChange: this.onFilterChange,
        customToolbar: this.buildCustomToolBar,
        elevation: 0,
        disableToolbarSelect: true,
        print: false
      }
    };
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
        item.options.filterType = "custom";
        //@ts-ignore
        item.options.customFilterListOptions = { update: cancelFilter };
        //@ts-ignore
        // item.options.filterOptions = { display: v => "" };
      }
      //@ts-ignore
      if (!_.isEmpty(item.dateType) && dateTypeValue) {
        item.name = dateTypeValue;
        item.label = _.get(
          _.find(dateTypeOptions, ["value", dateTypeValue]),
          "text",
          item.label
        );
      }
      return item;
    });
    return (
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <MUIDataTable
          title={title}
          data={data}
          columns={customizeColumns as any}
          options={customizeOptions as any}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

function cancelFilter(
  filterList: { [x: string]: never[] },
  filterPos: number,
  index: string | number
) {
  if (filterPos === 0) {
    filterList[index].splice(filterPos, 1);
  } else if (filterPos === 1) {
    filterList[index].splice(filterPos, 1);
  } else if (filterPos === -1) {
    filterList[index] = [];
  }
  console.log("customFilterListOnDelete: ", filterList, filterPos, index);

  return filterList;
}
