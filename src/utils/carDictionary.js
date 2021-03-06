const dictionay = {
  // 号牌种类
  HPZL: {
    '01': '大型汽车',
    '02': '小型汽车',
    '06': '外籍汽车',
    '07': '两、三轮车',
    '08': '轻便摩托车',
    13: '农用运输车',
    14: '拖拉机',
    15: '挂车',
    16: '教练车',
    17: '教练摩托车',
    23: '警用汽车',
    24: '警用摩托车',
    25: '',
    99: '其他号牌'
  },
  // 国产进口
  GCJK: {
    A: '国产（国产机动车）',
    B: '海关进口（进口机动车）',
    C: '公安没收（进口机动车）',
    D: '工商没收（进口机动车）',
    E: '海关没收（进口机动车）',
    F: '一车一证（进口机动车）',
    G: '海关监督（进口机动车）',
    H: '进口底盘（进口底盘国产机动车）',
    I: '解除监督（进口机动车）',
    Z: '其他'
  },
  // 违法行为
  WFXW: {
    1344: '违反“机动车违反禁令标志指示”',
    1345: '指机动车违反禁止标线指令行驶的违章行为',
    1301: '机动车逆向行驶',
    1309: '违反规定停放、临时停车且驾驶人不在现场或驾驶人虽在现场拒绝立即驶离,妨碍其它车辆、行人通行',
    1625: '闯红灯',
    1208: '机动车通过有灯控路口时不按所需行进方向驶入导向车道',
    6011: '指在高速公路或城市快速路以外的道路上行驶时,驾驶人未按规定使用安全带的违章行为',
    6023: '城市快速路以外的道路上不按规定车道行驶',
    1039: '超越执行紧急任务的警车、消防车、救护车、工程救险车的'
  }
}
export default dictionay
