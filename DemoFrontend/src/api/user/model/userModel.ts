import { BasicFetchResult, PaginationParams } from '../../model/baseModel';

export type GetUserModel = BasicFetchResult<User>;
export type GetUserAllModel = BasicFetchResult<User[]>;
export type GetStatusResModel = BasicFetchResult<StatusRes>;
export interface GetAccountAllParams extends PaginationParams {
  roles?: string;
  prefixAccount?: string;
}

export interface User {
  userID: number;
  account: string;
  password: string;
  comfirmPassword: string;
  name: string;
  roleID: number;
}

export interface Password {
  password: string;

  newPassword: string;
  comfirmPassword: string;
}

export interface StatusRes {
  status: boolean;
}
