// let声明变量只能在当前大括号内使用
const env = process.env.NODE_ENV
// const声明的是常亮,默认不可改变
const domain = '127.0.0.1:8080'
// 开发地址
const devUrl = 'http://127.0.0.1:9998'
// 生产环境地址
const prodUrl = 'http://' + domain + '/yinshuaibin'
// 开发地址
const devPicUrl = devUrl + '/image'
// 生产环境地址
const prodPicUrl = 'https://' + domain + '/pic'
// 备用地址
const backUpUrl = 'http://127.0.0.1:10086'
export const baseUrl = env === 'development' ? devUrl : env === 'production' ? prodUrl : backUpUrl
export const basePicUrl = env === 'development' ? devPicUrl : env === 'production' ? prodPicUrl : backUpUrl
export const webSocketUrl = env === 'development' ? devUrl.replace('http', 'ws') : env === 'production' ? 'wss://' + domain : backUpUrl
