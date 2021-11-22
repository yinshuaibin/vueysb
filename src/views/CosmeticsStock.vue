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
          化妆品名称 : <el-select v-model="query.stockType" placeholder="请选择化妆品名称" class="handle-select mr10" filterable>
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

        <el-button style="float: right" width="20%" type="primary" icon="el-icon-plus" @click="addUModal">新增进货信息
        </el-button>
      </div>
      <el-table height="660" :data="resultList" border class="table" ref="multipleTable"
        header-cell-class-name="table-header">
        <!-- <el-table-column prop="id" label="id">
        </el-table-column> -->
        <el-table-column label="化妆品名称">
          <template slot-scope="scope">
            <el-tag type="success">{{type[scope.row.stockType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stockTime" label="进货时间">
        </el-table-column>
        <el-table-column prop="stockClient" label="进货客户">
        </el-table-column>
        <el-table-column prop="stockNumber" label="数量">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-button :loading="exportLoading" v-show="resultList.length > 0" style="float: left" width="30%" type="primary" icon="el-icon-download"
          @click="exportResult(0)">导出当页数据
        </el-button>
        <el-button  :loading="exportLoading" v-show="resultList.length > 0" style="float: left" width="30%" type="primary" icon="el-icon-download"
          @click="exportResult(1)">导出查询结果
        </el-button>
        <el-pagination background layout="total, prev, pager, next" :current-page.sync="pageNum" :page-size="pageSize"
          :total="totalNum" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>

    <el-dialog :show-close='false' :close-on-press-escape='false' :close-on-click-modal='false'
      :title="update ? '修改进货信息' : '添加进货信息'" :visible.sync="dialogVisible" width="25%">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item prop="stockType" label="化妆品名称">
          <el-select v-model="form.stockType" placeholder="请选择化妆品类型" class="handle-select mr10" filterable>
            <el-option v-for="(value, key, index) in type" :key="index" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="stockClient" label="进货客户">
          <el-input :maxlength="50" v-model.trim="form.stockClient"></el-input>
        </el-form-item>
        <el-form-item prop="stockNumber" label="进货数量">
          <el-input-number v-model="form.stockNumber" :min="1" :max="10000" label="请选择进货数量"></el-input-number>
        </el-form-item>
        <el-form-item prop="stockTime" label="进货时间">
          <el-date-picker :editable="false" v-model="form.stockTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择进货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input :maxlength="50" v-model.trim="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
        <el-button @click="handleClose"> 取 消 </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import restApi from '@/api/restApi'
import { exportJsonToSheet } from '@/utils/execl'
export default {
  data () {
    return {
      pageSize: 10,
      pageNum: 1,
      query: {
        // 进货信息类型
        stockType: '',
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: ''
      },
      form: {
        stockType: '',
        stockClient: '',
        stockNumber: '',
        stockTime: '',
        remark: ''
      },
      update: false,
      requestQuery: {},
      resultList: [],
      totalNum: 0,
      exportLoading: false,
      // 类型
      type: {},
      dialogVisible: false,
      rules: {
        stockType: [{
          required: true,
          message: '化妆品名不能为空',
          trigger: 'blur'
        }],
        stockClient: [{
          required: true,
          message: '进货客户不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 50,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        }
        ],
        stockNumber: [{
          required: true,
          message: '进货数量不能为空',
          trigger: 'blur'
        }],
        stockTime: [{
          required: true,
          message: '进货时间不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    addUModal () {
      if (!this.update) {
        Object.keys(this.form).forEach(key => (this.form[key] = ''))
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          restApi.saveCosmeticsStock(this.form).then(data => {
            this.$notify({
              title: this.update ? '修改成功' : '添加成功',
              message: this.update ? '修改成功, 修改进货信息成功' : '添加成功, 添加进货信息成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.findAllCosmeticsStock(this.pageNum, this.pageSize)
          })
        }
      })
    },
    handleEdit (index, row) {
      this.update = true
      this.form = this.$_.cloneDeep(row)
      this.updateTemp = this.$_.cloneDeep(row)
      this.addUModal()
    },
    handleDelete (index, row) {
      this.$confirm('您确定要删除吗, 删除后不可恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restApi.deleteCosmeticsStock(row.id).then(data => {
          let pageNum = this.pageNum
          if (index === 0 && pageNum !== 1) {
            pageNum = pageNum - 1
          } else {
            pageNum = 1
          }
          this.findAllCosmeticsStock(pageNum, this.pageSize)
          this.$notify({
            title: '删除成功',
            message: '删除成功, 删除进货信息成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    handleClose () {
      this.update = false
      this.dialogVisible = false
    },
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
      restApi.findAllCosmeticsStock(this.requestQuery).then(data => {
        if (data.total && data.total > 0) {
          this.resultList = data.list
          this.totalNum = data.total
        } else {
          this.$notify({
            title: '查询成功',
            message: '查询成功, 并未查询到进货信息',
            type: 'success'
          })
        }
      })
    },
    handleCurrentChange (pageNum) {
      this.findAllCosmeticsStock(pageNum, this.pageSize)
    },
    handleSearch () {
      Object.keys(this.requestQuery).forEach(key => (this.requestQuery[key] = ''))
      this.requestQuery = this.$_.cloneDeep(this.query)
      this.findAllCosmeticsStock(1, this.pageSize)
    },
    exportResult (type) {
      this.exportLoading = true
      let name = '化妆品进货明细.xlsx'
      if (type) {
        if (this.totalNum > 10000) {
          this.$notify({
            title: '导出失败',
            message: '禁止一次性导出一万条以上数据',
            type: 'error'
          })
        } else {
          if (this.requestQuery.stockType === '0') {
            this.requestQuery.stockType = ''
          }
          this.requestQuery.pageNum = 1
          this.requestQuery.pageSize = this.totalNum
          restApi.findAllCosmeticsStock(this.requestQuery).then(data => {
            let temp = ''
            if (this.requestQuery.startDate) {
              temp += this.requestQuery.startDate
            }
            if (this.requestQuery.endDate) {
              if (temp) {
                temp += '-'
              }
              temp += this.requestQuery.endDate
            }
            if (this.requestQuery.stockType) {
              if (temp) {
                temp += '-'
              }
              temp += this.type[this.requestQuery.stockType] + '-' + name
              name = temp
            }
            this.export1(data.list, name)
          })
        }
      } else {
        this.export1(this.resultList, name)
      }
    },
    export1 (result, name) {
      const temp = this.$_.cloneDeep(result)
      temp.map(item => {
        item.stockType = this.type[item.stockType]
      })
      const header = {
        stockType: '化妆品名称',
        stockClient: '客户名称',
        stockNumber: '数量',
        stockTime: '时间',
        remark: '备注'
      }
      console.log(this.requestQuery)
      exportJsonToSheet(temp, header, '化妆品进货明细',
        name)
      this.exportLoading = false
    },
    init () {
      const p2 = restApi.findAllCosmeticsType({
        pageNum: 1,
        pageSize: 1000
      }).then(data => {
        if (data && data.total > 0) {
          for (const item of data.list) {
            this.type[item.typeId] = item.name
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
