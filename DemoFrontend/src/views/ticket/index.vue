<template>
  <div>
    Date:
    <a-range-picker
      v-model:value="timeInterval"
      format="YYYY-MM-DD HH:mm:ss"
      :showTime="{ format: 'HH:mm:ss' }"
      :ranges="ranges"
    />
    Severity:
    <a-select
      v-model:value="severityIDs"
      mode="multiple"
      show-search
      placeholder="Severity"
      style="width: 200px"
      :options="severityOption"
      allowClear
      @select="severitySelectChange"
    />
    TicketType:
    <a-select
      v-model:value="ticketTypeIDs"
      mode="multiple"
      show-search
      placeholder="TicketType"
      style="width: 200px"
      :options="ticketTypeOption"
      allowClear
      @select="ticketTypeSelectChange"
    />
    <a-button type="primary" @click="onSearch"> Search </a-button>

    <Drawer
      :severityCreateOption="severityCreateOption"
      :ticketTypeCreateOption="ticketTypeCreateOption"
      :submitApi="onCreate"
    >
      <template #btn>
        <a-button type="primary" style="float: right"> <PlusOutlined /> New Setting </a-button>
      </template>
    </Drawer>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      rowKey="ticketID"
      size="middle"
      :scroll="{ x: true }"
      ><template #action="{ record }">
        <a-button
          v-if="!record.isResolved && isResolve(record.type)"
          type="primary"
          shape="circle"
          @click="onResolve(record.ticketID)"
        >
          <CheckOutlined />
        </a-button>
        <Drawer
          :severityCreateOption="severityCreateOption"
          :ticketTypeCreateOption="ticketTypeUpdateOption"
          :submitApi="onUpdate"
          :data="record"
        >
          <template #btn>
            <a-button v-if="isCreate(record.type)" type="primary" shape="circle">
              <EditOutlined />
            </a-button>
          </template>
        </Drawer>
        <a-button type="primary" shape="circle" danger @click="onDelete(record.ticketID)">
          <DeleteFilled />
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { RangePicker } from 'ant-design-vue/lib/date-picker';
  import moment, { Moment } from 'moment';
  import { Table, Select, Modal, message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFetchDataList } from '/@/hooks/api/useFetchData';
  import { SelectTypes } from 'ant-design-vue/lib/select';
  import { OptionEnum } from '/@/enums/optionEnum';
  import { RoleEnum, TicketTypeEnum } from '/@/enums/ticketEnum';
  import * as ticketApi from '/@/api/ticket/ticket';
  import { Ticket } from '/@/api/ticket/model/ticketModel';
  import { CheckOutlined, PlusOutlined, DeleteFilled, EditOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/user';
  import Drawer from './Drawer.vue';
  const dataListToMapFn = (dataList: any) => {
    const convertedData = {};
    dataList.forEach((data) => {
      convertedData[data.value] = data?.name || '-';
    });
    return convertedData;
  };

  export default defineComponent({
    components: {
      [Table.name]: Table,
      [Select.name]: Select,
      [RangePicker.name]: RangePicker,
      [Modal.name]: Modal,
      EditOutlined,
      PlusOutlined,
      CheckOutlined,
      DeleteFilled,
      Drawer,
    },
    setup() {
      const { t } = useI18n('routes');
      const roleName = useUserStore().getUserInfo.roleName;
      const ranges = {
        'Past 30 Days': [moment().subtract(30, 'days').startOf('days'), moment().endOf('days')],
        'Past 7 Days': [moment().subtract(7, 'days').startOf('days'), moment().endOf('days')],
        Yesterday: [
          moment().subtract(1, 'days').startOf('days'),
          moment().subtract(1, 'days').endOf('days'),
        ],
        Today: [moment().startOf('days'), moment().endOf('days')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
      };

      const severityinfo = ref({});
      const ticketTypeinfo = ref({});

      const severityCreateOption = ref([]);
      const ticketTypeCreateOption = ref([]);
      const ticketTypeUpdateOption = ref([]);

      const timeInterval = ref<Moment[]>([
        moment().subtract(30, 'days').startOf('days'),
        moment().subtract(0, 'days').endOf('days'),
      ]);

      const severityIDs = ref([0]);
      const ticketTypeIDs = ref([0]);

      const { loading, dataSource, fetchParams, onEffect } = useFetchDataList(ticketApi.getList);

      const onSearch = () => {
        let severity = severityIDs.value.includes(0) ? undefined : severityIDs.value.join(',');
        let ticketType = ticketTypeIDs.value.includes(0)
          ? undefined
          : ticketTypeIDs.value.join(',');
        fetchParams.startTime = timeInterval.value[0].format('YYYY-MM-DD HH:mm:ss');
        fetchParams.endTime = timeInterval.value[1].format('YYYY-MM-DD HH:mm:ss');
        fetchParams.severities = severity;
        fetchParams.types = ticketType;
      };
      onSearch();

      // data CRUD
      const getOptions = () => {
        ticketApi.getOption().then((res) => {
          const { data } = res;
          severityinfo.value = dataListToMapFn(data[OptionEnum.Severity]);
          ticketTypeinfo.value = dataListToMapFn(data[OptionEnum.TicketType]);
          return res;
        });
      };

      const severityOption = computed<SelectTypes['options']>(() => {
        let result = Object.keys(severityinfo.value).map((info) => ({
          value: Number(info),
          label: severityinfo.value[info],
        }));
        severityCreateOption.value = result.map((r) => r);
        result.unshift({ value: 0, label: 'All' });
        return result;
      });

      const severitySelectChange = (value) => {
        if (value == 0) {
          severityIDs.value = [0];
        } else {
          let index = severityIDs.value.indexOf(0);
          if (index != -1) {
            severityIDs.value.splice(index, 1);
          }
        }
      };

      const ticketTypeSelectChange = (value) => {
        if (value == 0) {
          ticketTypeIDs.value = [0];
        } else {
          let index = ticketTypeIDs.value.indexOf(0);
          if (index != -1) {
            ticketTypeIDs.value.splice(index, 1);
          }
        }
      };

      const isCreate = (type: number) => {
        if (type == TicketTypeEnum.Bug || type == TicketTypeEnum.TestCase) {
          return roleName == RoleEnum.QA;
        } else if (type == TicketTypeEnum.FeatureRequest) {
          return roleName == RoleEnum.PM;
        }

        return true;
      };

      const ticketTypeOption = computed<SelectTypes['options']>(() => {
        let result = Object.keys(ticketTypeinfo.value).map((info) => ({
          value: Number(info),
          label: ticketTypeinfo.value[info],
        }));
        ticketTypeCreateOption.value = result.filter((r) => isCreate(r.value)).map((r) => r);

        ticketTypeUpdateOption.value = result.map((r) => r);
        result.unshift({ value: 0, label: 'All' });
        return result;
      });

      getOptions();
      const onCreate = (data: Ticket) => {
        return ticketApi.create(data).then(() => {
          message.success('Create Ticket success');
          onEffect();
        });
      };

      const onUpdate = (data: Ticket) => {
        return ticketApi.update(data).then(() => {
          message.success('Update Ticket success');
          onEffect();
        });
      };

      const onDelete = (id: number) => {
        return ticketApi.deleteTicket(id).then(() => {
          message.success('Delete Ticket success');
          onEffect();
        });
      };

      const onResolve = (id: number) => {
        return ticketApi.resolve(id).then(() => {
          message.success('Resolve Ticket success');
          onEffect();
        });
      };

      const isResolve = (type: number) => {
        if (type == TicketTypeEnum.Bug || type == TicketTypeEnum.FeatureRequest) {
          return roleName == RoleEnum.RD;
        } else if (type == TicketTypeEnum.TestCase) {
          return roleName == RoleEnum.QA;
        }

        return true;
      };

      const columns = [
        {
          title: 'TicketID',
          dataIndex: 'ticketID',
          key: 'ticketID',
          fixed: 'left',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          customRender: ({ text }) => {
            return ticketTypeinfo.value[text];
          },
        },
        {
          title: 'Severity',
          dataIndex: 'severity',
          key: 'severity',
          customRender: ({ text }) => {
            return severityinfo.value[text];
          },
        },
        {
          title: 'Summary',
          dataIndex: 'summary',
          key: 'summary',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'IsResolved',
          dataIndex: 'isResolved',
          key: 'isResolved',
          customRender: ({ text }) => {
            return text.toString();
          },
        },
        {
          title: 'ResolvedTime',
          dataIndex: 'resolvedTime',
          key: 'resolvedTime',
          customRender: ({ text }) => {
            return text ?? '-';
          },
        },
        {
          title: 'CreateBy',
          key: 'createBy',
          dataIndex: 'createBy',
        },
        {
          title: 'CreateTime',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: ({ text }) => {
            return text.toString();
          },
        },
        {
          title: 'Set Up',
          key: 'operation',
          fixed: 'right',
          slots: { customRender: 'action' },
        },
      ];

      return {
        t,
        loading,
        columns,
        dataSource,
        fetchParams,
        severityIDs,
        severityOption,
        ticketTypeOption,
        ticketTypeIDs,
        severitySelectChange,
        ticketTypeSelectChange,
        timeInterval,
        ranges,
        severityCreateOption,
        ticketTypeCreateOption,
        ticketTypeUpdateOption,
        onSearch,
        onCreate,
        onUpdate,
        onDelete,
        onResolve,
        isResolve,
        isCreate,
      };
    },
  });
</script>
