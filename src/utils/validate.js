/**
 * Created by ysb on 16/11/18.
 */

export function isvalidUsername (str) {
  const validMap = ['ss', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
