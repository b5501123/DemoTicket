import { BasicFetchResult, PaginationParams } from '../../model/baseModel';

export type GetSystemLogModel = BasicFetchResult<SystemLog>;
export type GetSystemLogAllModel = BasicFetchResult<SystemLog[]>;

export interface GetSystemLogAllParams extends PaginationParams {
  menus?: string;

  user?: string;
}
export interface SystemLog {
  systemLogID: string;
  userName: string;
  menu: number;
  action: number;
  dataID: string;
  dataName: string;
  fieldName: string;
  newValue: string;
  oldValue: string;
  createTime: number;
}
