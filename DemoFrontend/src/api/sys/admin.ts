import { SignUpParams, UpdatePwdParams } from './model/adminModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Admin = '',
}

export const post = (params: SignUpParams) => {
  return defHttp.post({ url: Api.Admin, params }, { errorMessageMode: 'modal' });
};

export const put = (params: UpdatePwdParams) => {
  return defHttp.put({ url: Api.Admin, params }, { errorMessageMode: 'modal' });
};
