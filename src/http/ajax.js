import axios from 'axios'
import Qs from 'qs'
import { Message} from 'element-ui'
import Vue from 'vue'
import router from '../router/index'

// const URL = 'http://127.0.0.1:8888/dev'
// const URL = 'http://192.168.0.114:8888/dev'
const URL = 'http://sjzh2016.ticp.io:8888/dev'

let loading
function startLoading () {
  loading = Vue.prototype.$loading({
    lock: true,
    text: '努力加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0)',
    target: document.querySelector('#loading') // 设置加载动画区域
  })
}
function endLoading () {
  loading.close()
}

// 声明一个对象用于存储请求个数
let needLoadingRequestCount = 0
function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
};
function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
};
var urlorigin = document.location.origin
// 环境的切换
if (process.env.NODE_ENV == 'development') {
  console.log(process.env.NODE_ENV+'-1--1-1--1-1--1-1-1-' )
  axios.defaults.baseURL = URL
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = URL
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = urlorigin + '/dev'
};

// 设置请求超时时间
axios.defaults.timeout = 600000

// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么 验证token之类的
  //  /unit/cpuUsage
  if (config.url.indexOf('/unit/') == -1 && config.url.indexOf('/cpuUsage/') == -1) {
    showFullScreenLoading()
  }
  return config
}, error => {
  // 对请求错误做些什么
  tryHideFullScreenLoading()
  Message.error({ message: '请求超时!' })
  return Promise.error(error)
})

// 响应拦截
axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  tryHideFullScreenLoading()
  return response
}, error => {
  // 对响应错误做点什么
  tryHideFullScreenLoading()
  return Promise.reject(error)
})

// 封装get方法和post方法

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    //  console.log(res.data)
    }).catch(err => {
      reject(err.data)
      console.log(err.data)
      Message({message: '加载失败', type: 'error'})
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
        console.log(res.data)
      })
      .catch(err => {
        reject(err.data)
        console.log(err.data)
        Message({message: '加载失败', type: 'error'})
      })
  })
}

/**
 * post方法，参数序列化
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function qspost2 (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, Qs.stringify(params))
      .then(res => {
        resolve(res.data)
        console.log(res.data)
      })
      .catch(err => {
        reject(err.data)
        console.log(err.data)
        Message({message: '加载失败', type: 'error'})
      })
  })
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(res => {
        resolve(res.data)
        console.log(res.data)
      })
      .catch(err => {
        reject(err.data)
        console.log(err.data)
        Message({message: '加载失败', type: 'error'})
      })
  })
}

/**
 * delete
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function deletefn (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(res => {
        resolve(res.data)
        console.log(res.data)
      })
      .catch(err => {
        reject(err.data)
        console.log(err.data)
        Message({message: '加载失败', type: 'error'})
      })
  })
}
