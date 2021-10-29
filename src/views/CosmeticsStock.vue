<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .handle-box span {
    margin-left: 15px
  }
      .im_ul {
    width: 100%;
    height: 60px;
  }

  .im_ul li {
    list-style: none;
    width: 25%;
    height: 30px;
    float: left;
    display: block;
  }
/**
  出库单查询
 */
</style>
<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="iconfont icon-zhipinku"></i> 进货查询
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="margin-bottom:10px">
        <span>
          类型 : <el-select v-model="query.stockType" placeholder="请选择类型" class="handle-select mr10">
            <el-option v-for="(value, key, index) in type" :key="index" :label="value" :value="key">
            </el-option>
          </el-select>
        </span>
        <span>
          开始日期 : <el-date-picker :editable="false" v-model="query.startDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </span>
        <span>
          结束日期 : <el-date-picker :editable="false" v-model="query.endDate" type="date" value-format="yyyy-MM-dd"
            :placeholder="'请选择结束时间'">
          </el-date-picker>
        </span>
        <el-button style="margin-left:15px" width="30%" type="primary" icon="el-icon-search" @click="handleSearch">搜索
        </el-button>
      </div>
      <el-table height="660" :data="resultList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <!-- <el-table-column prop="id" label="id">
        </el-table-column> -->
        <el-table-column label="名称" >
          <template slot-scope="scope">
            <el-tag type="success">{{type[scope.row.stockType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" >
        </el-table-column>
        <el-table-column prop="stockNumber" label="数量" >
        </el-table-column>
        <!-- <el-table-column label="确认方式">
          <template slot-scope="scope">
             <span>{{scope.row.successStatus == 1 ? 'RFID确认' : scope.row.successStatus === 0 ? '手动确认' : '未确认'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="#" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="details(scope.row)">详情
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page.sync="pageNum" :page-size="pageSize"
          :total="totalNum" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>

        <el-dialog :title="'出库单-' + bom.id" :close-on-click-modal='false' :visible.sync="dialogVisible" width="50%">
      <ul class="im_ul">
        <li span="5"> 单 号: {{bom.id}}</li>
        <li span="5"> 创建人: {{bom.createUser}}</li>
        <li span="5"> 出库人: {{bom.recorder}}</li>
        <li span="9"> 创建时间: {{bom.createTime}}</li>
        <li span="5"> 类 型: {{type[bom.stockType]}}</li>
        <li span="5"> 仓 库: {{wareHouse[bom.wareId]}}</li>
        <li span="5"> 状 态: {{'已出库'}}</li>
        <li span="9"> 出库时间: {{bom.successTime}}</li>
      </ul>
      <el-table height="532" :data="materials" border class="table" ref="multipleTable"
        header-cell-class-name="table-header">
        <!-- <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="mid" label="编号">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{mater[scope.row.materId]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库区">
          <template slot-scope="scope">
            <span>{{warehouseArea[scope.row.wareAreaId]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-pagination
          style="float:left"
          small
          layout="prev, pager, next, total"
          :current-page.sync="dialogVisiblePageNum" :page-size="dialogVisiblePageSize"
          :total="materialsList.length" @current-change="dialogVisibleHandleCurrentChange">
        </el-pagination>
        <el-button  @click="handleClose"> 关 闭 </el-button>
        <el-button type="primary"  @click="exportBom"> 打 印 </el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import restApi from '@/api/restApi'
export default {
  data () {
    return {
      pageSize: 30,
      pageNum: 1,
      query: {
        // 化妆品类型
        stockType: '',
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: ''
      },
      requestQuery: {},
      resultList: [],
      totalNum: 0,
      // 仓库
      wareHouse: {
      },
      // 类型
      type: {},
      // 出库单详情
      bom: {},
      dialogVisible: false,
      materials: [],
      materialsList: [],
      dialogVisiblePageNum: 1,
      dialogVisiblePageSize: 10
    }
  },
  watch: {},
  computed: {},
  methods: {
    findAllCosmeticsStock (pageNum, pageSize) {
      if (pageNum === 1) {
        this.resultList = []
        this.totalNum = 0
      }
      if (this.requestQuery.stockType === '0') {
        this.requestQuery.stockType = ''
      }
      this.requestQuery.pageNum = pageNum
      this.requestQuery.pageSize = pageSize
      // 4代表已出库
      restApi.findAllCosmeticsStock(this.requestQuery).then(data => {
        if (data.total && data.total > 0) {
          this.resultList = data.list
          this.totalNum = data.total
        } else {
          this.$notify({
            title: '查询成功',
            message: '查询成功, 并未查询到出库单信息',
            type: 'success'
          })
        }
      })
    },
    handleCurrentChange (pageNum) {
      this.findAllCosmeticsStock(pageNum, this.pageSize)
    },
    dialogVisibleHandleCurrentChange (pageNum) {
      const start = (pageNum - 1) * this.dialogVisiblePageSize
      const end = pageNum * this.dialogVisiblePageSize
      this.materials = this.materialsList.slice(start, end)
    },
    handleClose () {
      this.bom = {}
      this.dialogVisible = false
    },
    handleSearch () {
      Object.keys(this.requestQuery).forEach(key => (this.requestQuery[key] = ''))
      this.requestQuery = this.$_.cloneDeep(this.query)
      this.findAllCosmeticsStock(1, this.pageSize)
    },
    details (row) {
      this.bom = this.$_.cloneDeep(row)
      restApi.findMaterialByBomId(row.id).then((data) => {
        this.dialogVisible = true
        this.materialsList = data
        this.materials = this.materialsList.slice(0, this.dialogVisiblePageSize)
      })
    },
    exportBom () {
      this.dialogVisible = false
    },
    init () {
      const p2 = restApi.findAllCosmeticsType({
        pageNum: 1,
        pageSize: 1000
      }).then(data => {
        if (data && data.total > 0) {
          for (const item of data.list) {
            this.type[item.id] = item.name
          }
        }
      }).catch(err => {
        console.error(err)
      })
      Promise.all([p2]).then(data => {
        this.findAllCosmeticsStock(1, this.pageSize)
      })
    }
  },
  mounted () {
    this.init()
  }
}

</script>
