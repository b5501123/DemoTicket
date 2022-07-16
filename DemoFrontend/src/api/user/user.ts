import { defHttp } from '/@/utils/http/axios';
import {
  GetUserModel,
  GetUserAllModel,
  GetAccountAllParams,
  Password,
  User,
  GetStatusResModel,
} from './model/userModel';

enum Api {
  GetList = '/User/GetList',
  Create = '/User/Create',
  Update = '/User/Update',
  Delete = '/User/Delete',
  UpdatePassword = '/User/UpdatePassword',

  UpdateOwnPassword = '/Auth/UpdatePassword',
  CheckAccount = '/User/CheckAccount',
}

export const getList = (params: GetAccountAllParams) => {
  return defHttp.get<GetUserAllModel>(
    { url: Api.GetList, params },
    { errorMessageMode: 'message' },
  );
};
export const create = (params: User) => {
  return defHttp.post<GetUserModel>({ url: Api.Create, params }, { errorMessageMode: 'message' });
};

export const updateUser = (params: User) => {
  return defHttp.put<GetUserModel>({ url: Api.Update, params }, { errorMessageMode: 'message' });
};
export const updatePassword = (params: User) => {
  return defHttp.put<GetUserModel>(
    { url: Api.UpdatePassword, params },
    { errorMessageMode: 'message' },
  );
};

export const updateOwnPassword = (params: Password) => {
  return defHttp.put<GetStatusResModel>(
    { url: Api.UpdateOwnPassword, params },
    { errorMessageMode: 'message' },
  );
};

export const checkAccount = (account: string) => {
  return defHttp.get<GetStatusResModel>(
    { url: `${Api.CheckAccount}/${account}` },
    { errorMessageMode: 'message' },
  );
};

export const deleteUser = (id: number) => {
  return defHttp.delete<GetStatusResModel>(
    { url: `${Api.Delete}/${id}` },
    { errorMessageMode: 'message' },
  );
};
