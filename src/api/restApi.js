import {
  // 查询
  get,
  // add,insert
  post
  // getFile
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
  return post('/login?username=' + param.username + '&password=' + param.password)
}
restApi.ttt = () => {
  return get('/open/redisTest')
}
restApi.getAllPic = () => {
  return get('/ysb/getAllPic')
}
restApi.delPic = (param) => {
  return get('/ysb/delPic', { fileName: param })
}
restApi.findAllSave = (param) => {
  return post('/ysb/findAllSave', param)
}
restApi.findAllCosmeticsStock = (param) => {
  return post('/ysb/findAllCosmeticsStock', param)
}
restApi.findAllCosmeticsType = (param) => {
  return post('/ysb/findAllCosmeticsType', param)
}
restApi.saveCosmeticsType = (param) => {
  return post('/ysb/saveCosmeticsType', param)
}
restApi.deleteType = (param) => {
  return get('/ysb/deleteType', { id: param })
}
