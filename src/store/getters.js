// import _ from 'lodash'
// 获取统一计算处理后的state属性值,并缓存起来,直至重新计算
export default {
  /**
   * 获取用户,如果用户不存在则尝试从sessionStorage中获取
   * 如果均不存在则返回空;
   */
  getUser: (state, getters) => {
    if (state.user) {
      if (Object.keys(state.user).length) {
        return state.user
      }
    }
    if (localStorage.getItem('user')) {
      state.user = JSON.parse(localStorage.getItem('user'))
      return state.user
    }
    return {}
  },
  /**
   * 获取用户id;
   */
  getUserId: (state, getters) => {
    return getters.getUser.userId
  },
  /**
   * 获取token,用来验证是否登录
   */
  getToken: (state) => {
    if (state.token) {
      return state.token
    } else {
      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        return state.token
      }
    }
    return null
  },

  // 获取websocketurl
  getWebSocketUrl: (state, getters) => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境websocket地址  production为生产环境
      if (location.protocol === 'https:') {
        const ipandport = getters.getUser.commonIp
        const yuming = ipandport.substring(0, ipandport.indexOf(':'))
        return 'wss://' + yuming + '/websocket/' + getters.getUserId + '/' + getters.getUserRoleRoleId
      } else {
        return 'ws://' + getters.getUser.commonIp + '/websocket/' + getters.getUserId + '/' + getters.getUserRoleRoleId
      }
    } else {
      // 开发环境websocket地址  development为开发环境
      return '127' + '/' + getters.getUserId + '/' + getters.getUserRoleRoleId
    }
  },
  // 获取websocketurl
  getCameraWebSocketUrlPrefix: (state, getters) => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境websocket地址  production为生产环境
      if (location.protocol === 'https:') {
        const ipandport = getters.getUser.commonIp
        const yuming = ipandport.substring(0, ipandport.indexOf(':'))
        return 'wss://' + yuming + '/websocket/'
      } else {
        return 'ws://' + getters.getUser.commonIp + '/websocket/'
      }
    } else {
      // 开发环境websocket地址  development为开发环境
      return '123' + '/'
    }
  }
}
