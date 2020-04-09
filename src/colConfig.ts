/* eslint-disable max-lines */
import dayjs from "dayjs";

export enum RequestType {
  ISSUE = 1,
  REDEEM = 2
}
export enum RequestStatus {
  //ステータス 1:awaiting_approval / 2:approved / 3:suspended / 4:failed / 5:confirmed / 6:segregated / 7:rejected(使わない)
  AWAITING_APPROVAL = 1,
  APPROVED = 2,
  SUSPENDED = 3,
  FAILED = 4,
  CONFIRMED = 5,
  SEGREGATED = 6,
  REJECTED = 7
}

export const EnumText = {
  RequestType: {
    [RequestType.ISSUE]: "issue",
    [RequestType.REDEEM]: "redeem"
  },
  RequestStatus: {
    [RequestStatus.AWAITING_APPROVAL]: "awaiting approval",
    [RequestStatus.APPROVED]: "approved",
    [RequestStatus.SUSPENDED]: "suspended",
    [RequestStatus.FAILED]: "failed",
    [RequestStatus.CONFIRMED]: "confirmed",
    [RequestStatus.SEGREGATED]: "segregated",
    [RequestStatus.REJECTED]: "rejected"
  }
};
export function getEnumTextByEnum(Enum: any, EnumText: any) {
  return EnumText[Enum] || "-";
}

const RenderRequestTypeText = (text: RequestType) =>
  getEnumTextByEnum(text, EnumText.RequestType);
const RenderStatus = (text: RequestStatus) =>
  getEnumTextByEnum(text, EnumText.RequestStatus);
const dateFormatRender = (text: number) =>
  dayjs.unix(text).format("YYYY/MM/DD HH:mm:ss");

export const columns = [
  {
    name: "userName",
    label: "Requester"
  },
  {
    name: "requestType",
    label: "Request Type",
    copyRender: RenderRequestTypeText,
    options: { customBodyRender: RenderRequestTypeText }
  },
  {
    name: "status",
    copyName: "requestStatusText",
    label: "Status",
    copyRender: RenderStatus,
    options: { customBodyRender: RenderStatus }
  },
  {
    name: "unit",
    label: "Currency"
  },
  {
    name: "amount",
    label: "Amount",
    options: { filter: false }
  },
  {
    name: "createAt",
    label: "Requested Time",
    isDateFilter: true,
    // dateType: [
    //   { name: "createAt", label: "Requested Time" },
    //   { name: "approvedAt", label: "Approved Time" },
    //   { name: "confirmedAt", label: "Confirmed Time" },
    //   { name: "segregatedAt", label: "Segregated Time" },
    //   { name: "suspendedAt", label: "Suspended Time" },
    //   { name: "rejectedAt", label: "Rejected Time" }
    // ],
    copyRender: dateFormatRender,
    options: { filter: false, customBodyRender: dateFormatRender }
  },
  {
    name: "notes",
    label: "Note",
    options: { sort: false, filter: false }
  },
  {
    name: "EditNote",
    label: "Edit Note",
    options: { sort: false, filter: false, download: false }
  }
];

export const data = [
  {
    id: "1",
    requestType: 1,
    createAt: "1577281040",
    confirmedAt: "1576676232",
    suspendedAt: "1576503432",
    approvedAt: "1576589832",
    segregatedAt: "1576849032",
    rejectedAt: "1576762632",
    userId: "6",
    userName: "manager1",
    amount: "101",
    unit: "JPYS",
    status: 1,
    withdrawalStatus: 0,
    notes: "123456",
    version: "1"
  },
  {
    id: "2",
    requestType: 1,
    createAt: "1577281045",
    confirmedAt: "1576676232",
    suspendedAt: "1576503432",
    approvedAt: "1576589832",
    segregatedAt: "1576849032",
    rejectedAt: "1576762632",
    userId: "6",
    userName: "manager1",
    amount: "102",
    unit: "JPYS",
    status: 2,
    withdrawalStatus: 0,
    notes: "123456",
    version: "1"
  },
  {
    id: "3",
    requestType: 1,
    createAt: "1577281020",
    confirmedAt: "1576676232",
    suspendedAt: "1576503432",
    approvedAt: "1576589832",
    segregatedAt: "1576849032",
    rejectedAt: "1576762632",
    userId: "6",
    userName: "manager2",
    amount: "103",
    unit: "JPYS",
    status: 3,
    withdrawalStatus: 0,
    notes: "123456",
    version: "1"
  },
  {
    id: "4",
    requestType: 1,
    createAt: "1577281032",
    confirmedAt: "1576676232",
    suspendedAt: "1576503432",
    approvedAt: "1576589832",
    segregatedAt: "1576849032",
    rejectedAt: "1576762632",
    userId: "6",
    userName: "manager2",
    amount: "104",
    unit: "JPYS",
    status: 4,
    withdrawalStatus: 0,
    notes: "123456",
    version: "1"
  }
];
