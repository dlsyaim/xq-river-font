import axios from 'axios';
import Vue from 'vue';
import {getCookie} from "./util";

axios.defaults.validateStatus = () => true;
export const get = (url, params) => {
  // const accessToken = localStorage.getItem('v5Token');
  const accessToken = getCookie('v5Token');
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      headers: {
        'token': accessToken
      },
      params: params
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else if(res.status === 403) {
        localStorage.clear();
        window.location.href="http://61.240.12.212:9081?info=v5&from=" + window.location.origin + window.location.pathname;
      } else {
        handleHttpError(err);
        resolve(err.data)
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};
export const post = (url,params, data) => {
  // const accessToken = localStorage.getItem('v5Token');
  const accessToken = getCookie('v5Token');
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: {
        "token": accessToken
      },
      params:params,
      data: data
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        resolve(res.data);
      } else if(res.status === 403) {
        localStorage.clear();
        window.location.href="http://61.240.12.212:9081?info=v5&from=" + window.location.origin + window.location.pathname;
      } else {
        handleHttpError(err);
        resolve(err.data)
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};

export const put = (url, data) => {
  // const accessToken = localStorage.getItem('v5Token');
  const accessToken = getCookie('v5Token');
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: url,
      headers: {
        "Access-Token": accessToken
      },
      data: data
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else if(res.status === 403) {
        localStorage.clear();
        window.location.href="http://61.240.12.212:9081?info=v5&from=" + window.location.origin + window.location.pathname;
      } else {
        handleHttpError(err);
        resolve(err.data)
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};

export const deleteRequest = (url) => {
  // const accessToken = localStorage.getItem('v5Token');
  const accessToken = getCookie('v5Token');
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url: url,
      headers: {
        "Access-Token": accessToken
      }
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else if(res.status === 403) {
        localStorage.clear();
        window.location.href="http://61.240.12.212:9081?info=v5&from=" + window.location.origin + window.location.pathname;
      } else {
        handleHttpError(err);
        resolve(err.data)
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};
/**
 * 处理http请求错误
 * @param err
 */
const handleHttpError = (err) => {
  Vue.prototype.$message.error('服务器出错');
};
/**
 * 处理业务逻辑错误
 * @param err
 */
const handleBusinessError = (err) => {
  Vue.prototype.$message.error(err.msg);
};
