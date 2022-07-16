import { BasicFetchResult } from '../../model/baseModel';

export type GetLoginModel = BasicFetchResult<Login>;

export interface Login {
  nickName: string;
  jwtToken: string;
  account: string;
}
