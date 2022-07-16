<template>
  <span @click.stop="showDrawer">
    <slot name="btn"></slot>
  </span>
  <a-drawer
    :title="isCreate ? 'Create a Role' : 'Update Role'"
    width="40%"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form layout="vertical"
      ><a-row :gutter="40">
        <a-col :span="24">
          <a-form-item label="Type" v-bind="validateInfos.type">
            <a-select
              v-model:value="formRef.type"
              :options="ticketTypeCreateOption"
              placeholder="Please enter type"
              show-search
              :disabled="!isCreate"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Severity" v-bind="validateInfos.severity">
            <a-select
              v-model:value="formRef.severity"
              :options="severityCreateOption"
              placeholder="Please enter severity"
              show-search
              :disabled="!isCreate"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="40">
        <a-col :span="24">
          <a-form-item label="summary" v-bind="validateInfos.summary">
            <a-textarea v-model:value="formRef.summary" placeholder="Basic usage" :rows="1" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="40">
        <a-col :span="24">
          <a-form-item label="description" v-bind="validateInfos.description">
            <a-textarea v-model:value="formRef.description" placeholder="Basic usage" :rows="4" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 10,
      }"
    >
    </div>
    <a-button style="margin-right: 8px" @click="onClose" :loading="loading">Cancel</a-button>
    <a-button type="primary" @click="onSumbmit" :loading="loading">Submit</a-button>
  </a-drawer>
</template>
<script lang="ts">
  import {
    FormItem,
    Col,
    Row,
    Form,
    Table,
    Select,
    Drawer,
    Switch,
    Tabs,
    Textarea,
  } from 'ant-design-vue';
  import { defineComponent, reactive, ref, toRaw } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Ticket } from '/@/api/ticket/model/ticketModel';

  const useForm = Form.useForm;
  export default defineComponent({
    components: {
      [Col.name]: Col,
      [Row.name]: Row,
      [Form.name]: Form,
      [Select.name]: Select,
      [FormItem.name]: FormItem,
      [Drawer.name]: Drawer,
      [Switch.name]: Switch,
      [Tabs.name]: Tabs,
      [Table.name]: Table,
      [Textarea.name]: Textarea,
      [Tabs.TabPane.name]: Tabs.TabPane,
    },
    props: {
      severityCreateOption: {
        type: Object as PropType<any[]>,
        required: true,
      },
      ticketTypeCreateOption: {
        type: Object as PropType<any[]>,
        required: true,
      },
      data: {
        type: Object as PropType<Ticket>,
        required: false,
        default: () => ({
          ticketID: 0,
          type: null,
          severity: null,
          summary: null,
          description: null,
        }),
      },
      submitApi: {
        type: Function as PropType<(data: Ticket) => Promise<void>>,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n('routes');
      const copyData: Ticket & { sellPrice?: number } = {
        ...cloneDeep(props.data),
      };
      // main form
      const formRef = reactive(copyData);
      const { resetFields, validate, validateInfos } = useForm(
        formRef,
        reactive({
          name: [
            {
              validator: async (record, value: string) => {
                return Promise.resolve();
              },
              trigger: 'change',
            },
          ],
        }),
        { validateOnRuleChange: false },
      );

      const reset = () => {
        resetFields();
      };
      const visible = ref<boolean>(false);
      const loading = ref<boolean>(false);
      const permissionRef = ref([]);
      const isCreate = props.data?.ticketID ? false : true;
      const onSumbmit = () => {
        loading.value = true;

        Promise.resolve()
          .then(() => validate())
          .then(() => {
            const copyForm = cloneDeep(toRaw(formRef));
            return props.submitApi(copyForm);
          })
          .then(() => {
            onClose();
          })
          .finally(() => {
            loading.value = false;
          });
      };
      const onCheckName = () => {
        return true;
      };
      const showDrawer = () => {
        visible.value = true;
      };

      const onClose = () => {
        visible.value = false;
        reset();
      };

      return {
        formRef,
        validateInfos,
        visible,
        loading,
        showDrawer,
        onClose,
        isCreate,
        activeKey: ref('1'),
        permissionRef,
        onCheckName,
        onSumbmit,
        t,
      };
    },
  });
</script>
