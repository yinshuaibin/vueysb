<style scoped>
  .fixed {
    position: fixed;
    bottom: 0;
    width: 410px;
    height: 330px;
    left: 48%;
    top: 42%;
    margin-left: -150px
      /*为.fixed宽的一半*/
    ;
    margin-top: -150px
      /*为.fixed高的一半*/
    ;
    background: #0f5194 !important
  }

  #particlesId {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('../../../static/img/bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
  }

</style>
<template>
  <div id="particlesId">
    <vue-particles color="#dedede" :particleOpacity="0.7" :particlesNumber="80" shapeType="circle" :particleSize="4"
      linesColor="#dedede" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <Card class="fixed">
      <div>
        <p style="margin: 8px 0px 12px 0px;font-size:28px;color:black">请登录</p>
        <Form :model="loginUser" ref="loginUser" :rules="loginRule">
          <FormItem prop="username" label="用户名">
            <Input size="large" @on-change="deleteEdit()" v-model="loginUser.username" placeholder="请输入用户名">
            <Icon size="18" type="ios-contact" slot="prefix"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password" label="密码">
            <Input size="large" @on-change="deleteEdit()" @keyup.enter.native="login" :on-enter="login" :type="pwdType"
              width="30%" v-model="loginUser.password" placeholder="请输入密码">
            <Icon size="18" type="ios-lock-outline" slot="prefix"></Icon>
            </Input>
          </FormItem>
        </Form>
        <p v-show="errorMsg" style="font-size: 16px;color: red;margin-right:60%;margin-top: -12px">{{errorMsg}}</p>
        <div>
          <!-- <Button size="large" @click="showPwd">{{this.pwdType === 'password' ? '显示密码' : '隐藏密码'}}</Button> -->
          <Button @click="login" size="large" type="primary"
            :loading="loading">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
        </div>
      </div>
    </Card>
    <div>
    </div>
  </div>
</template>

<script>
import restApi from '@/api/restApi'
export default {
  name: 'Login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value.length > 10) {
        callback(new Error('密码不能大于10位'))
      } else {
        callback()
      }
    }
    return {
      errorMsg: '',
      loginUser: {
        username: '',
        password: ''
      },
      loginRule: {
        username: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        },
        {
          validator: validatePass
        }
        ]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  watch: {

  },
  created () {},
  mounted () {
    // alert(this.$moment(new Date()).format('yyyy-MM-dd'))
  },
  methods: {
    deleteEdit () {
      this.errorMsg = ''
    },
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = 'text'
      } else {
        this.pwdType = 'password'
      }
    },
    login () {
      this.$refs.loginUser.validate(valid => {
        if (valid) {
          this.deleteEdit()
          this.loading = true
          restApi.login(this.loginUser).then(data => {
            this.loading = false
            if (data.code && data.code === '200') {
              this.$store.commit('setUser', data)
              this.$router.push('/Home')
            } else {
              this.errorMsg = data
            }
          }).then(data => {

          }).catch(e => {
            this.loading = false
            this.errorMsg = '服务器无响应'
          })
        } else {
          return false
        }
      })
    }
  }
}

</script>

<style>
</style>
