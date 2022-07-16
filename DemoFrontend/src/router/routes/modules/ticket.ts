import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/ticket',
  name: 'ticket',
  component: LAYOUT,
  redirect: '/ticket/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ri:lock-password-line',
    title: 'ticket',
    orderNo: 100,
  },
  children: [
    {
      path: 'index',
      name: 'ticketManagement',
      component: () => import('/@/views/ticket/index.vue'),
      meta: {
        title: 'ticket',
        icon: 'ri:lock-password-line',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
