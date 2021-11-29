import { Message } from 'element-ui';

const login = (loginUrl) => {
  window.location.href = `${loginUrl + window.location.href}`;
};

// 接口正常状态处理方法
export const handleResponse = (res, msg) => {
  msg && Message({
    message: typeof msg === 'boolean' ? res.data.rspMsg || '操作成功！' : `${msg}成功！`,
    type: 'success',
    duration: 3000,
  });
  return res.data.result;
};

// 接口异常状态处理方法
export const handleError = (error, msg) => {
  if (error.response) {
    if (error.response.data) {
      const status = error.response.data.rspCode;
      switch (status) {
        case '000000002':
          login(process.env.NODE_ENV.VUE_APP_LOGIN);
          break;
        default:
          Message.error(error.toString());
      }
    } else {
      Message.error(error.toString());
    }
  } else if (error.data) {
    const errorRes = error.data;
    switch (errorRes.code) {
      case '000000002':
        // 未登录
        login(process.env.NODE_ENV.VUE_APP_LOGIN);
        break;
      case '000000003':
        // 没权限
        login(errorRes.rspData);
        break;
      default:
        Message({
          message: errorRes.msg || (msg && `${msg}失败`) || '操作失败',
          type: 'warning',
          duration: 5 * 1000,
        });
    }
  } else {
    Message.error(error.toString());
  }
  return false;
};
