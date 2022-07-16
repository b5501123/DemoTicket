import { ref, watchEffect, reactive, unref, onMounted } from 'vue';
import { BasicFetchResult, PaginationParams } from '/@/api/model/baseModel';
import { cleanObject, clearObject } from '/@/utils';

export function useFetchData<FetchParamsType extends PaginationParams, DataType extends Object>(
  fetcher: (args: FetchParamsType) => Promise<BasicFetchResult<DataType>>,
  initData: DataType,
  initFetchParams: FetchParamsType,
  assigner: (res: BasicFetchResult<DataType>, dataSource: DataType) => void,
) {
  const loading = ref(true);
  const dataSource = reactive(initData) as DataType;
  const initPagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    hideOnSinglePage: true,
    position: 'top',
    onChange: (page: number) => {
      pagination.current = page;
    },
  };
  const pagination = reactive({ ...initPagination });
  type FetcherParameter = Parameters<typeof fetcher>[0];
  const fetchParams = reactive<FetcherParameter>(initFetchParams);
  const onEffect = () => {
    loading.value = true;
    fetcher({
      ...cleanObject(unref(fetchParams)),
      page: pagination.current,
      pageSize: pagination.pageSize,
    } as FetchParamsType)
      .then((res) => {
        const { meta } = res;
        pagination.total = meta?.total;
        pagination.current = meta?.page ?? 1;
        pagination.pageSize = meta?.pageSize ?? 10;
        assigner(res, dataSource);
        return res;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  onMounted(() => {
    watchEffect(onEffect);
  });

  const reset = () => {
    Object.assign(dataSource, initData);
    Object.assign(pagination, initPagination);
    clearObject(fetchParams);
  };
  return {
    loading,
    dataSource,
    pagination,
    fetchParams,
    reset,
    onEffect,
  };
}

function DataObjectAssigner<DataType extends Object>(
  res: BasicFetchResult<DataType>,
  dataSource: DataType,
) {
  clearObject(dataSource);
  setTimeout(() => {
    Object.assign(dataSource, res.data);
  }, 0);
}

function DataListAssigner<DataType extends Array<Object>>(
  res: BasicFetchResult<DataType>,
  dataSource: DataType,
) {
  dataSource.length = 0;
  setTimeout(() => {
    Object.assign(dataSource, res.data);
  }, 0);
}

export function useFetchDataObject<
  FetchParamsType extends PaginationParams,
  DataType extends Object,
>(
  fetcher: (args: FetchParamsType) => Promise<BasicFetchResult<DataType>>,
  initFetchParams: FetchParamsType = {} as FetchParamsType,
) {
  return useFetchData(fetcher, {} as DataType, initFetchParams, DataObjectAssigner);
}

export function useFetchDataList<
  FetchParamsType extends PaginationParams,
  DataType extends Array<Object>,
>(
  fetcher: (args: FetchParamsType) => Promise<BasicFetchResult<DataType>>,
  initFetchParams: FetchParamsType = {} as FetchParamsType,
) {
  return useFetchData(fetcher, [] as unknown as DataType, initFetchParams, DataListAssigner);
}
