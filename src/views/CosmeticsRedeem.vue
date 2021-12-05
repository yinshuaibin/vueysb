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
          <i class="iconfont icon-zhipinku"></i> 兑奖查询
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="margin-bottom:10px">
        <span>
          化妆品名称 : <el-select v-model="query.redeemType" placeholder="请选择化妆品名称" class="handle-select mr10" filterable>
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
        <el-button type="primary" icon="el-icon-plus" style="float:right;margin-bottom:10px" width="30%" @click="addUModal">新增
        </el-button>
      </div>
      <el-table height="660" :data="resultList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <!-- <el-table-column prop="id" label="id">
        </el-table-column> -->
        <el-table-column label="化妆品名称" >
          <template slot-scope="scope">
            <el-tag type="success">{{type[scope.row.redeemType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="redeemClient" label="兑奖客户" >
        </el-table-column>
        <el-table-column prop="createTime" label="兑奖时间" >
        </el-table-column>
        <el-table-column prop="redeemNumber" label="兑奖数量" >
        </el-table-column>
        <el-table-column prop="remark" label="备注" >
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
    :title="update ? '修改兑奖信息' : '新增兑奖信息'" :visible.sync="dialogVisible" width="25%">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item prop="redeemType" label="化妆品名称">
          <el-select v-model="form.redeemType" placeholder="请选择化妆品类型" class="handle-select mr10" filterable>
            <el-option v-for="(value, key, index) in type" :key="index" :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="redeemClient" label="兑奖用户">
          <el-input :maxlength="50" v-model.trim="form.redeemClient"></el-input>
        </el-form-item>
        <el-form-item prop="redeemNumber" label="兑奖数量">
          <el-input-number v-model="form.redeemNumber" :min="1" :max="10000" v-model.trim="form.redeemNumber"></el-input-number>
        </el-form-item>
        <el-form-item prop="redeemTime" label="兑奖时间">
          <el-date-picker :editable="false" v-model="form.redeemTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择兑奖时间">
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
    const validateName = (rule, value, callback) => {
      if (value) {
        restApi.findAllCosmeticsType({
          pageSize: 1,
          pageNum: 1,
          name: value
        }).then(data => {
          if (data.total && data.total > 0) {
            if (!this.update || (this.update && value !== this.updateTemp.name)) {
              callback(new Error('化妆品名称不允许重复'))
            }
          }
          callback()
        })
      }
    }
    return {
      pageSize: 30,
      pageNum: 1,
      query: {
        // 化妆品类型
        redeemType: '',
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: ''
      },
      requestQuery: {},
      resultList: [],
      totalNum: 0,
      exportLoading: false,
      // 仓库
      wareHouse: {
      },
      // 类型
      type: {},
      // 新增
      form: {
        redeemType: '',
        redeemClient: '',
        redeemNumber: '',
        redeemTime: '',
        remark: ''
      },
      rules: {
        redeemType: [{
          required: true,
          message: '化妆品名不能为空',
          trigger: 'blur'
        }],
        redeemClient: [{
          required: true,
          message: '兑奖用户不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 50,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        },
        {
          validator: validateName
        }],
        redeemNumber: [{
          required: true,
          message: '兑奖数量不能为空',
          trigger: 'blur'
        }],
        redeemTime: [{
          required: true,
          message: '兑奖时间不能为空',
          trigger: 'blur'
        }]
      },
      dialogVisible: false,
      update: false,
      materials: [],
      materialsList: [],
      dialogVisiblePageNum: 1,
      dialogVisiblePageSize: 10
    }
  },
  watch: {},
  computed: {},
  methods: {
    findAllCosmeticsRedeem (pageNum, pageSize) {
      if (pageNum === 1) {
        this.resultList = []
        this.totalNum = 0
      }
      if (this.requestQuery.redeemType === '0') {
        this.requestQuery.redeemType = ''
      }
      this.requestQuery.pageNum = pageNum
      this.requestQuery.pageSize = pageSize
      // 4代表已出库
      restApi.findAllCosmeticsRedeem(this.requestQuery).then(data => {
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
          restApi.saveOrUpdateCosmeticsRedeem(this.form).then(data => {
            this.$notify({
              title: this.update ? '修改成功' : '添加成功',
              message: this.update ? '修改成功' : '添加成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.findAllCosmeticsRedeem(this.pageNum, this.pageSize)
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
        restApi.deleteCosmeticsRedeem(row.id).then(data => {
          let pageNum = this.pageNum
          if (index === 0 && pageNum !== 1) {
            pageNum = pageNum - 1
          } else {
            pageNum = 1
          }
          this.findAllCosmeticsRedeem(pageNum, this.pageSize)
          this.$notify({
            title: '删除成功',
            message: '删除成功, 删除兑奖信息成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    handleCurrentChange (pageNum) {
      this.findAllCosmeticsRedeem(pageNum, this.pageSize)
    },
    handleClose () {
      this.update = false
      this.dialogVisible = false
    },
    handleSearch () {
      Object.keys(this.requestQuery).forEach(key => (this.requestQuery[key] = ''))
      this.requestQuery = this.$_.cloneDeep(this.query)
      this.findAllCosmeticsRedeem(1, this.pageSize)
    },
    exportResult (type) {
      this.exportLoading = true
      let name = '化妆品兑奖明细.xlsx'
      if (type) {
        if (this.totalNum > 10000) {
          this.$notify({
            title: '导出失败',
            message: '禁止一次性导出一万条以上数据',
            type: 'error'
          })
        } else {
          if (this.requestQuery.redeemType === '0') {
            this.requestQuery.redeemType = ''
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
            if (this.requestQuery.redeemType) {
              if (temp) {
                temp += '-'
              }
              temp += this.type[this.requestQuery.redeemType] + '-' + name
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
        item.redeemType = this.type[item.redeemType]
      })
      const header = {
        redeemType: '化妆品名称',
        redeemClient: '兑奖客户',
        redeemNumber: '兑奖数量',
        redeemTime: '兑奖时间',
        remark: '备注'
      }
      console.log(this.requestQuery)
      exportJsonToSheet(temp, header, '化妆品兑奖明细',
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
            this.type[item.id] = item.name
          }
        }
      }).catch(err => {
        console.error(err)
      })
      Promise.all([p2]).then(data => {
        this.findAllCosmeticsRedeem(1, this.pageSize)
      })
    }
  },
  mounted () {
    this.init()
  }
}

</script>
