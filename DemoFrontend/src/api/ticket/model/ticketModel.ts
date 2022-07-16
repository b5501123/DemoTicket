import { BasicFetchResult, PaginationParams } from '../../model/baseModel';

export type GetTicketModel = BasicFetchResult<boolean>;
export type GetTicketAllModel = BasicFetchResult<Ticket[]>;

export type OptionsModel = BasicFetchResult<Options[]>;

export interface GetTicketAllParams extends PaginationParams {
  types?: string;
  severities?: string;
  isResolved?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface Ticket {
  ticketID: number;
  type: number;
  severity: number;
  summary: string;

  description: string;
  isResolved: boolean;
  isDel: boolean;
  resolvedTime?: number;
  createBy: string;
  createTime: number;
}

export interface Options {
  name: string;
  value: number;
}
