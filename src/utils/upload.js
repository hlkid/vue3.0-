import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_UPLOAD_FILE, // api 的 base_url
  timeout: 5000, // 请求超时时间
  xhrFields: {
    withCredentials: true
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 用户操作
    if (config.method == 'post' || config.method == 'put' || config.method == 'delete') {
      store.dispatch('ToggleVloading', true);
    };
    // get请求避免缓存
    config.method == 'get' && (
      config.params = Object.assign(config.params ? config.params : {}, { _t: +new Date() })
    );
    // config.headers.content-type  = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    Message({
      message: '请求发生未知错误',
      type: 'error',
      duration: 5 * 1000
    })
    setTimeout(() => {
      store.dispatch('ToggleVloading', false);
    }, 1000)
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    /**
     * 文件导出
     * */
    if (response.config.responseType === 'blob') {
      return response;
    }
    if (res.code == 200) {
      store.dispatch('ToggleVloading', false);
      return res;
    } else {
      if (res.code == 401) {
        // token过期
        // store.dispatch('FedLogOut');
        store.dispatch('ToggleVloading', false);
        Message({
          message: '您的还没有登录，或者您的登录已过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        });
        // 跳转登录
        router.push('/login');
      } else {
        setTimeout(() => {
          store.dispatch('ToggleVloading', false);
        }, 1000)
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      // return Promise.reject('请求错误')
      return res
    }
  },
  error => {
    // console.log(error)
    /**
     *   Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
     */
    store.dispatch('ToggleVloading', false);
    return Promise.reject(error);
  }
)

export default service
