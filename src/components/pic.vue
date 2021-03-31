<style scoped>
.demo-upload-list{
        display: inline-block;
        width: 260px;
        height: 260px;
        text-align: center;
        line-height: 260px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
<template>
  <div >
     <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
        <template v-if="item.status === 'finished'">
            <img style="object-fit: contain" :src="picPrifix + item.name">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item, index)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="10240"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        :action="picAction"
        style="display: inline-block;width:258px;">
        <div style="width: 258px;height:258px;line-height: 258px;">
            <Icon type="ios-camera" size="200"></Icon>
        </div>
    </Upload>
    <Modal title="" v-model="visible">
        <img :src="'http://127.0.0.1:9998/image/' + imgName + ''" v-if="visible" style="object-fit: contain;width:100%">
    </Modal>
  </div>
</template>

<script>
import restApi from '@/api/restApi'
import { baseUrl, basePicUrl } from '@/utils/globalConfig.js'
export default {
  name: 'Login',
  data () {
    return {
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      uploadList2: []
    }
  },
  watch: {
    uploadList2 (val) {
      if (val.length > 0) {
        this.uploadList.push(val[val.length - 1])
      }
    }
  },
  created () {

  },

  computed: {
    picAction () {
      return baseUrl + '/ysb/savePic'
    },
    picPrifix () {
      return basePicUrl + '/'
    }
  },
  mounted () {
    // alert(this.$moment(new Date()).format('yyyy-MM-dd'))
    this.uploadList2 = this.$refs.upload.fileList
    this.getAllPic()
  },
  methods: {
    getAllPic () {
      restApi.getAllPic().then(data => {
        data.forEach(item => {
          this.uploadList.push({
            status: 'finished',
            name: item
          })
        })
      })
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file, index) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定要删除该图片吗? 删除后无法恢复',
        onOk: () => {
          const name = file.name
          restApi.delPic(name).then(data => {
            this.uploadList.splice(index, 1)
          }).catch(() => {
            this.$Message.error('删除失败')
          })
        }
      })
    },
    handleSuccess (res, file) {
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '文件名称为' + file.name + ' 不符合要求,  请选择jpg或png格式的图片.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片过大',
        desc: '图片  ' + file.name + ' 过大, 图片大小禁止超过10M.'
      })
    },
    handleBeforeUpload () {
      return true
    }
  }
}

</script>

<style>
</style>
