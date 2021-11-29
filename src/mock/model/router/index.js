export default {
  'get|/api/routes': () => {
    return {
      code: '000000000',
      msg: 'success',
      result: [
        {
          path: '/personal',
          name: '导航1',
          children: [
            {
              path: '/personal/apply-table',
              name: '导航1-1',
              icon: 'asm-shishijisuanpingtai1x',
            },
            {
              path: '/personal/api',
              name: '导航1-2',
              children: [
                {
                  path: '/personal/api/test',
                  name: '导航1-2-1',
                  children: [
                    {
                      path: '/personal/api/test1',
                      name: '导航1-2-1-1',
                    },
                  ],
                },
              ],
            },
            {
              path: '/personal/apply-manage',
              name: '导航1-3',
            },
          ],
        },
        {
          path: '/platform',
          name: '导航2',
          children: [
            {
              path: '/platform/authority',
              name: '导航2-1',
            },
            {
              path: '/platform/api-classify',
              name: '导航2-2',
            },
          ],
        },
      ],
    };
  },
};
