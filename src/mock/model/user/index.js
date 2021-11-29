export default {
  'post|/api/user': () => {
    return {
      code: '000000000',
      msg: 'success',
      result: {
        email: 'test@jd.com',
        permissions: null,
        realName: '王延锋',
        roles: null,
        token: '',
        userId: '1741499',
        username: 'wangyanfeng9',
      },
    };
  },
};
