import { GetLoginModel } from './model/loginModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Url = '/login',
}

export const post = () => {
  return defHttp.post<GetLoginModel>({ url: Api.Url }, { errorMessageMode: 'message' });
};
