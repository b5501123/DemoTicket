import { ref, onMounted, watch, Ref, isRef } from 'vue';

export function useExpandTableToggle<DataType, KeyType>(
  dataList: Array<DataType> | Ref<Array<DataType>>,
  getKey: (data: DataType, index: number) => KeyType,
  expandToggle = ref<boolean>(false),
) {
  const expandedRowKeys = ref<KeyType[]>([]) as Ref<KeyType[]>;
  onMounted(() => {
    watch(
      () => {
        const originDataList = isRef(dataList) ? dataList.value : dataList;
        return expandToggle.value ? originDataList.map((data, index) => getKey(data, index)) : null;
      },
      (keys) => {
        expandedRowKeys.value.length = 0;
        if (expandToggle.value && keys) {
          expandedRowKeys.value = keys;
        }
      },
      {
        immediate: true,
      },
    );
  });

  const onExpandedRowsChange = (rows) => {
    expandedRowKeys.value = rows;
  };

  return {
    expandToggle,
    expandedRowKeys,
    onExpandedRowsChange,
  };
}
