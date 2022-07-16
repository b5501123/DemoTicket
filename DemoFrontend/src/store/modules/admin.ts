import { defineStore } from 'pinia';
import { store } from '/@/store';
import { AdminResultData, AdminResultModel, ICreateAdmin } from '/@/api/admin/model/adminModel';
import { createAdmin, getAdminList, updateAdminInfo } from '/@/api/admin/admin';

interface AdminState {
  loading: boolean;
  list: Array<AdminResultData>;
  lastUpdateTime: number;
}

export const useAdminStore = defineStore({
  id: 'app-admin',
  state: (): AdminState => ({
    // admin user list
    list: [],
    loading: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  // getters: {
  // },
  actions: {
    async getAdminList(): Promise<AdminResultModel> {
      try {
        this.loading = true;
        const res = await getAdminList();
        this.list = res;
        return { data: res };
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },
    async createAdmin(param: ICreateAdmin): Promise<any> {
      try {
        this.loading = true;
        const res = await createAdmin(param);
        await this.getAdminList();
        return { data: res };
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },
    async updateAdminData(id: number, key: string, val: string): Promise<any> {
      try {
        this.loading = true;
        const param: any = {};
        param[key] = val;
        const res = await updateAdminInfo(id, param);
        await this.getAdminList();
        return { data: res };
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },
  },
});

// Need to be used outside the setup
export function useAdminStoreWithOut() {
  return useAdminStore(store);
}
