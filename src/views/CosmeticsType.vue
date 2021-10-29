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
        <el-button type="primary" icon="el-icon-plus" style="float:right;margin-bottom:10px" width="30%" @click="addUModal">添加化妆品类别
        </el-button>
        <span>
          名称 :  <el-input :maxlength="50" style="width:150px" v-model.trim="query.name"></el-input>
        </span>
        <!-- <span>
          开始日期 : <el-date-picker :editable="false" v-model="query.startDate" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </span>
        <span>
          结束日期 : <el-date-picker :editable="false" v-model="query.endDate" type="date" value-format="yyyy-MM-dd"
            :placeholder="'请选择结束时间'">
          </el-date-picker>
        </span> -->
        <el-button style="margin-left:15px" width="30%" type="primary" icon="el-icon-search" @click="handleSearch">搜索
        </el-button>
      </div>
      <el-table height="660" :data="resultList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="createTime" label="添加时间" >
        </el-table-column>
        <el-table-column prop="name" label="名称" >
        </el-table-column>
         <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page.sync="pageNum" :page-size="pageSize"
          :total="totalNum" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>

      <el-dialog :title="update ? '修改化妆品' : '添加化妆品'" :visible.sync="dialogVisible" width="35%">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item prop="name" label="化妆品名称">
          <el-input :maxlength="50" v-model.trim="form.name"></el-input>
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
        // 化妆品名称
        name: ''
      },
      form: {
        name: ''
      },
      requestQuery: {},
      resultList: [],
      totalNum: 0,
      dialogVisible: false,
      update: false,
      updateTemp: {},
      rules: {
        name: [{
          required: true,
          message: '化妆品名不能为空',
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
        }]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    addUModal () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          restApi.saveCosmeticsType(this.form).then(data => {
            this.$notify({
              title: this.update ? '修改成功' : '添加成功',
              message: this.update ? '修改成功, 修改化妆品成功' : '添加成功, 添加化妆品成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.findAllCosmeticsType(this.pageNum, this.pageSize)
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
        restApi.deleteType(row.id).then(data => {
          if (data > 0) {
            let pageNum = this.pageNum
            if (index === 0 && pageNum !== 1) {
              pageNum = pageNum - 1
            } else {
              pageNum = 1
            }
            this.findAllCosmeticsType(pageNum, this.pageSize)
            this.$notify({
              title: '删除成功',
              message: '删除成功, 删除化妆品成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {
      })
    },
    findAllCosmeticsType (pageNum, pageSize) {
      if (pageNum === 1) {
        this.resultList = []
        this.totalNum = 0
      }
      this.requestQuery.pageNum = pageNum
      this.requestQuery.pageSize = pageSize
      restApi.findAllCosmeticsType(this.requestQuery).then(data => {
        if (data.total && data.total > 0) {
          this.resultList = data.list
          this.totalNum = data.total
        } else {
          this.$notify({
            title: '查询成功',
            message: '查询成功, 并未查询到商品类型信息',
            type: 'success'
          })
        }
      })
    },
    handleCurrentChange (pageNum) {
      this.findAllCosmeticsType(pageNum, this.pageSize)
    },
    handleClose () {
      this.update = false
      this.dialogVisible = false
    },
    handleSearch () {
      Object.keys(this.requestQuery).forEach(key => (this.requestQuery[key] = ''))
      this.requestQuery = this.$_.cloneDeep(this.query)
      this.findAllCosmeticsType(1, this.pageSize)
    },
    exportBom () {
      this.dialogVisible = false
    },
    init () {
      this.findAllCosmeticsType(1, this.pageSize)
    }
  },
  mounted () {
    this.init()
  }
}

</script>
