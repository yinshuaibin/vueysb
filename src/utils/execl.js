import XLSX from 'xlsx'
import _ from 'lodash'

/**
 * json数据导出excel文件
 *
 * @param {Array} data 导出的json数据
 * @param {Object} headers Sheet对应的标题头
 * @param {String} sheetName 单栏Sheet名
 * @param {String} fileName 文件名
 *
 * @description 依赖于xlsx的js库,目前仅实现了简单标题头常规数据的导出.
 */
function exportJsonToSheet (data, headers, sheetName, fileName) {
  // 根据excel标题头获取对应的json数据
  var result = _.map(data, (item, index) => {
    var obj = {}
    for (const key in headers) {
      if (_.has(item, key)) {
        obj[headers[key]] = item[key]
      }
    }
    return obj
  })

  /* 将json数据转成worksheet */
  var ws = XLSX.utils.json_to_sheet(result)
  // 设置列宽
  ws['!cols'] = [
    { width: 21 },
    { width: 18 },
    { width: 10 },
    { width: 16 },
    { width: 20 }
  ]

  /* 新建wb */
  var wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  /* 写文件 */
  XLSX.writeFile(wb, fileName)
}
export {
  exportJsonToSheet
}
