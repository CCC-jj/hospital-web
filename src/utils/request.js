import axios from "axios";
import Vue from "vue";
import router from "../router";
// import {Message,MessageBox,Loading} from 'element-ui'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
});

// axios请求拦截,前端发起请求之前拦截
service.interceptors.request.use(
  config => {
    if (localStorage.getItem("token")) {
      config.headers["Authorization"] = localStorage.getItem("token");
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// axios响应拦截,后端返回响应后拦截
service.interceptors.response.use(response => {
  // console.log(response);
    if (response.data.code == "TokenExpired") {
      localStorage.removeItem("token")
      Vue.prototype.$message.info('token过期，请退出并重新登录！')
      router.push('/login')
      window.document.title = "医生工作站";
    }
  return response.data;
});

/**
 * get
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * post请求
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      method: "POST",
      url: url,
      data: data
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * patch请求
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    service.patch(url, data).then(
      response => {
        resolve(response.data);
      },
      error => {
        reject(error);
      }
    );
  });
}

/**
 * put请求
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    service.put(url, data).then(
      response => {
        resolve(response.data);
      },
      error => {
        reject(error);
      }
    );
  });
}

export default service;
