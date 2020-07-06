import {
  // 查询
  get,
  // add,insert
  post,
  getFile
  // update
  // put,
  // update
  // patch,
  // delete
  // remove
} from './http.js'
const restApi = {}

export default restApi

restApi.login = (param) => {
  return post('/login', param)
}
restApi.ttt = () => {
  return get('/ttt')
}
restApi.getFile = (url) => {
  return getFile(url)
}
restApi.sendHeart = () => {
  return get('/face_get/sendHeart')
}
restApi.shutDown = () => {
  return get('/face_get/shutDown')
}
restApi.updateConfig = (params) => {
  return post('/face_post/updateConfig', params)
}
restApi.getPort = () => {
  return get('/face_get/getPort')
}
restApi.stopServer = () => {
  return get('/face_get/stopServer')
}
restApi.startServer = () => {
  return get('/face_get/startServer')
}
restApi.restartServer = () => {
  return get('/face_get/restartServer')
}
restApi.logout = () => {
  return get('/face_get/logout')
}
restApi.getKey = () => {
  return get('/face_get/getKey')
}
restApi.getConfig = () => {
  return get('/face_get/getConfig')
}
restApi.checkTumingKey = (param) => {
  return post('/face_post/checkTumingKey', param)
}
