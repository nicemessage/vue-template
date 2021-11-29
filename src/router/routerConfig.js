export default [
  {
    path: '/personal',
    name: 'Personal',
    redirect: '/personal/apply-table',
    component: () => import('@/views/layouts/TopNav/Container/index.vue'),
    // component: () => import('@/views/layouts/LeftNav/Container/index.vue'),
    meta: {
      title: '导航1',
    },
    children: [
      {
        path: '/personal/apply-table',
        name: 'ApplyTable',
        component: () => import('@/views/personal/development/ApplyTable.vue'),
        meta: {
          title: '导航1-1',
          breadcrumbArry: [
            { name: '导航1', path: '/personal' },
            { name: '导航1-1', path: '/personal/apply-table' },
          ],
          activeItem: '/personal1/apply-table',
        },
      },
      {
        path: '/personal/api',
        name: 'Api',
        component: () => import('@/views/personal/development/Api.vue'),
        meta: {
          title: '导航1-2',
          breadcrumbArry: [{ name: 'API开发', path: '/personal/api' }],
          activeItem: '/personal/api',
        },
        redirect: '/personal/api/test',
        children: [
          {
            path: '/personal/api/test',
            name: 'test',
            component: () => import('@/views/personal/application/ApplyManage.vue'),
            meta: {
              title: '导航1-2-1',
              breadcrumbArry: [
                { name: '导航1', path: '/personal' },
                { name: '导航1-2', path: '/personal/api' },
                { name: '导航1-2-1', path: '/personal/api/test' },
              ],
              activeItem: '/personal/apply-manage',
            },
          },
        ],
      },
      {
        path: '/personal/apply-manage',
        name: 'ApplyManage',
        component: () => import('@/views/personal/application/ApplyManage.vue'),
        meta: {
          title: '导航1-3',
          // breadcrumbArry: [{ name: '应用管理', path: '/personal/apply-manage' }],
          activeItem: '/personal/apply-manage',
        },
      },
    ],
  },
  {
    path: '/platform',
    name: 'Platform',
    component: () => import('@/views/layouts/TopNav/Container/index.vue'),
    // component: () => import('@/views/layouts/LeftNav/Container/index.vue'),
    meta: {
      title: '导航2',
    },
    redirect: '/platform/authority',
    children: [
      {
        path: '/platform/authority',
        name: 'Authority',
        component: () => import('@/views/platform/Authority'),
        meta: {
          title: '导航2-1',
          activeItem: '/platform/authority',
        },
        children: [],
      },
      {
        path: '/platform/api-classify',
        name: 'ApiClassify',
        component: () => import('@/views/platform/ApiClassify'),
        meta: {
          title: '导航2-2',
          icon: '',
          activeItem: '/platform/api-classify',
        },
        children: [],
      },
    ],
  },
];
