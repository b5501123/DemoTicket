import { AxiosRequestConfig } from 'axios';

export interface Meta {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  order: string;
  sortBy: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  order?: string;
  sortBy?: string;
}

export interface BasicFetchResult<T> {
  data: T;
  meta: Meta;
}

export interface AxiosRequestConfigWithParams<T> extends AxiosRequestConfig {
  params: T;
}
