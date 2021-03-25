// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
export default {
  /**
   * 保存用户信息到user对象,并保存到sessionStorage
   * @param {*} state
   * @param {*} payload
   */
  setUser (state, payload) {
    localStorage.setItem('user', JSON.stringify(payload))
    state.token = 'ysb' + payload.msg
    localStorage.setItem('token', state.token)
  },
  clearUser (state, payload) {
    state.user = null
    state.token = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  // 触发点击导航地址,将当前的页面换成对应的;
  menuSelectEvent (state, name) {
    state.activeTabName = name
  },
  setToken (state, payload) {
    state.token = payload
    localStorage.setItem('token', payload)
  }
}
