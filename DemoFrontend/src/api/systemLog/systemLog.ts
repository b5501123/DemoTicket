import { defHttp } from '/@/utils/http/axios';
import { GetSystemLogAllModel, GetSystemLogAllParams } from './model/systemLogModel';

enum Api {
  GetList = '/SystemLog/GetList',
}

export const getList = (params: GetSystemLogAllParams) => {
  return defHttp.get<GetSystemLogAllModel>(
    { url: Api.GetList, params },
    { errorMessageMode: 'message' },
  );
};
