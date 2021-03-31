// http.js
// ajax工具
import axios from 'axios'
// npm仓库管理的包,可通过npm install qs进行安装
import qs from 'qs'
// 引入请求的地址
import { baseUrl } from '@/utils/globalConfig.js'
// 引入消息提示
import Message from 'view-design/src/components/message/index'
// 引入全局store
import store from '@/store/index.js'
// 引入路由,未登录或登录失效时跳转使用
// import router from '@/router/index.js'

// 设置提示
Message.config({
  top: 250,
  duration: 5
})
// ajax统一请求设置
var instance = axios.create({
  baseURL: baseUrl,
  // 序列化
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      arrayFormat: 'repeat'
    })
  },
  // 带cookie请求
  withCredentials: false, // 默认带,此处不带
  validateStatus: function (status) {
    return status >= 200 && status < 400 // 设置默认合法请求状态码
  },
  timeout: 6000
})
var messageFlag = true
// request拦截器
instance.interceptors.request.use(
  config => {
    if (store.getters.getToken) {
      config.headers.Authorization = store.getters.getToken // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)
// 响应时拦截
instance.interceptors.response.use(response => {
  if (response.data && response.data.code === '401') {
    Message.error('权限不足')
  }
  // 返回响应时做一些处理
  return response
}, error => {
  try {
    // 当响应异常时做一些处理
    const status = error.response.status
    if (status === 504) {
      if (messageFlag) {
        Message.error('网络异常, 请稍后重试')
        messageFlag = false
        setTimeout(() => {
          messageFlag = true
        }, 8000)
      }
      return Promise.reject(error)
    }
    const e = error.response.data
    if (e) {
      if (e.code && e.code === 402) {
        Message.error('重复操作')
      }
    }
    return Promise.reject(error)
  } catch (e) {
    console.log(e)
    return Promise.reject(error)
  }
})
// 封装get方法, post方法
// 返回Promise对象
/**
 * get请求
 * @param { String} url 请求的url地址
 * @param { Object} obj 请求参数,序列化后追加到url上
 */
export function get (url, obj) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: obj
    }).then(function (response) {
      if (response) {
        resolve(response.data)
      }
    }).catch(function (err) {
      reject(err)
    })
  })
}

export function post (url, params, time) {
  return new Promise((resolve, reject) => {
    instance.post(url, params, time ? { timeout: time } : {}).then(function (response) {
      if (response) {
        resolve(response.data)
      }
    }).catch(function (err) {
      reject(err)
    })
  })
}

export function put (url, params) {
  return new Promise((resolve, reject) => {
    instance.put(url, params).then(function (response) {
      if (response) {
        resolve(response.data)
      }
    }).catch(function (err) {
      reject(err)
    })
  })
}

export function patch (url, params) {
  return new Promise((resolve, reject) => {
    instance.patch(url, params).then(function (response) {
      if (response) {
        resolve(response.data)
      }
    }).catch(function (err) {
      reject(err)
    })
  })
}

/**
 * 将参数追加到请求地址上,然后发送删除请求
 * @param {* String} url 请求地址
 * @param {* Object} obj 请求对象,delete操作,请求参数会追加到url后面
 */
export function remove (url, obj) {
  return new Promise((resolve, reject) => {
    instance.delete(url, {
      params: obj
    }).then(function (response) {
      if (response) {
        resolve(response.data)
      }
    }).catch(function (err) {
      reject(err)
    })
  })
}

/**
 * 向服务器请求下载图片
 * @param {* String} url 请求地址
 * responseType: 'arraybuffer' 返回值类型
 */
export function getFile (url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    }).then(function (response) {
      if (response) {
        resolve(response.data)
      }
    }).catch(function (err) {
      reject(err)
    })
  })
}
