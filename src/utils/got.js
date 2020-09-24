'use strict'
const got = require('got')
var $got = {}
$got.install = function (Vue, option) {
  Object.defineProperty(Vue.prototype, '$got', { value: got })
}
export default $got
