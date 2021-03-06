/* eslint-disable no-unused-expressions */
import axios from 'axios';
import { Loading } from 'element-ui';
import buildParamsSerializer from './buildParamsSerializer';
import { handleResponse, handleError } from './deal';

// 创建axios实例
const service = axios.create({
  // 如果url不是绝对路径，那么会将baseURL和url拼接作为请求的接口地址
  baseURL: process.env.VUE_APP_BASIC_API,
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 10000, // 超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const api = {};

[
  ['get', 'params'],
  ['post', 'data'],
].forEach((item) => {
  const method = item[0];
  api[item[0]] = (url, opt, msg, loading) => new Promise((resolve, reject) => {
    let loadingInstance = null;
    loading
      && (loadingInstance = Loading.service({
        fullscreen: true,
      }));
    const paramsSerializer = buildParamsSerializer('toString');
    service({
      method,
      url,
      [item[1]]: opt,
      paramsSerializer,
    })
      .then((res) => {
        console.log(res);
        res.data.code === '000000000'
          ? resolve(handleResponse(res, msg))
          : reject(handleError(res, msg));
      })
      .catch((error) => {
        reject(handleError(error, msg));
      })
      .finally(() => {
        loading && loadingInstance.close();
      });
  });
});

const service1 = axios.create({
  // 如果url不是绝对路径，那么会将baseURL和url拼接作为请求的接口地址
  baseURL: process.env.VUE_APP_BASIC_LIMIT,
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000, // 超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8',
  },
});
export const limit = {};

[
  ['get', 'params'],
  ['post', 'data'],
].forEach((item) => {
  const method = item[0];
  limit[item[0]] = (url, opt, msg, loading) => new Promise((resolve, reject) => {
    let loadingInstance = null;
    loading
      && (loadingInstance = Loading.service1({
        fullscreen: true,
      }));
    const paramsSerializer = buildParamsSerializer('toString');
    service1({
      method,
      url: `${url}?token=${process.env.VUE_APP_TOKEN}&sub_token=${process.env.VUE_APP_SUBTOKEN}`,
      [item[1]]: opt,
      paramsSerializer,
    })
      .then((res) => {
        res.data.code === '000000000'
          ? resolve(handleResponse(res, msg))
          : reject(handleError(res, msg));
      })
      .catch((error) => {
        reject(handleError(error, msg));
      })
      .finally(() => {
        loading && loadingInstance.close();
      });
  });
});
