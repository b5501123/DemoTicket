import { defHttp } from '/@/utils/http/axios';
import {
  GetTicketModel,
  GetTicketAllModel,
  GetTicketAllParams,
  OptionsModel,
  Ticket,
} from './model/ticketModel';

enum Api {
  GetList = '/Ticket/List',
  Create = '/Ticket/',
  Update = '/Ticket/',
  Delete = '/Ticket/',

  Option = '/Ticket/Option',
}

export const getList = (params: GetTicketAllParams) => {
  return defHttp.get<GetTicketAllModel>(
    { url: Api.GetList, params },
    { errorMessageMode: 'message' },
  );
};

export const getOption = () => {
  return defHttp.get<OptionsModel>({ url: Api.Option }, { errorMessageMode: 'message' });
};

export const create = (params: Ticket) => {
  return defHttp.post<GetTicketModel>({ url: Api.Create, params }, { errorMessageMode: 'message' });
};

export const update = (params: Ticket) => {
  return defHttp.put<GetTicketModel>(
    { url: `${Api.Delete}${params.ticketID}`, params },
    { errorMessageMode: 'message' },
  );
};

export const deleteTicket = (id: number) => {
  return defHttp.delete<GetTicketModel>(
    { url: `${Api.Delete}${id}` },
    { errorMessageMode: 'message' },
  );
};

export const resolve = (id: number) => {
  return defHttp.put<GetTicketModel>(
    { url: `${Api.Update}${id}/Resolve` },
    { errorMessageMode: 'message' },
  );
};
