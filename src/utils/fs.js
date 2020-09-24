'use strict'
import fs from 'fs'
var $fs = {}
$fs.install = function (Vue, option) {
  Object.defineProperty(Vue.prototype, '$fs', { value: fs })
}
export default $fs
