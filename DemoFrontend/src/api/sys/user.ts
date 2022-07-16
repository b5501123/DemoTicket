import { defHttp, defLocalHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { UserInfo } from '/#/store';

enum Api {
  Login = '/Auth/LogIn',
  LoginJWT = '/login-jwt',
  Logout = '/logout',
  GetUserInfo = '/Auth/UserInfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp
    .get<LoginResultModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'modal' })
    .then((res) => {
      const { data } = res;
      // TODO: real user info
      return {
        userId: data.userId,
        username: data.nickName,
        realName: data.nickName,
        avatar:
          'https://lh3.googleusercontent.com/ixUl8GNk3MnqFt8BC_OLv2Vh1GTPNd2W2rFyjOUkYpyMztgppduyv_065_mtDIHxVv06k0O9ZTF8QTu6aPh8wnbKspuvyQWxa4Alag',
        roles: [
          {
            roleName: 'Super Admin',
            value: 'super',
          },
        ],
      } as UserInfo;
    });
}

export function getPermCode() {
  return defLocalHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defLocalHttp.get({ url: Api.Logout });
}
