<style scoped>
  .websocket {
    background:#eee;
    padding: 20px;
    height: 400px;
  }
  .card{
    height: 360px;
    overflow: auto;
  }
</style>
<template>
  <div style="margin-top:15px;">
    <Button type="primary" @click="ttt">测试重复操作</Button>
    <Button type="primary" @click="toWebsocketMsg">测试发送消息</Button>
    <Button style="float:right" type="primary" @click="logout">退出</Button>
    <Row class="websocket">
      <Col span="11" >
        <Card class="card" :bordered="false">
           <Input v-model="sendMessage1" search enter-button="发送" @on-search="search1" />
           <p style="margin-top: 10px" v-for="(item, index) in message1" :key="index">
             {{item}}
           </p>
        </Card>
      </Col>
      <Col span="11" offset="2">
        <Card class="card" :bordered="false">
           <Input v-model="sendMessage2" search enter-button="发送" @on-search="search2" />
           <p style="margin-top: 10px" v-for="(item, index) in message2" :key="index">
             {{item}}
           </p>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col>
        <pic></pic>
      </Col>
    </Row>
  </div>
</template>

<script>
// @ is an alias to /src
import restApi from '@/api/restApi'
import pic from '@/components/pic'
import { webSocketUrl } from '@/utils/globalConfig.js'

export default {
  name: 'Home',
  components: {
    pic
  },
  data () {
    return {
      isConnect: false,
      websocket: null,
      webSocket2: null,
      message1: [],
      message2: [],
      sendMessage1: '',
      sendMessage2: '',
      sid1: 1,
      sid2: 2
    }
  },
  watch: {
  },
  methods: {
    initWebSoctet () {
      const vm = this
      this.websocket = new WebSocket(webSocketUrl + '/websocket/1/1')
      this.websocket.onopen = function (e) {
        console.log('WebSocket连接成功')
        vm.heartCheckStart()
      }
      this.websocket.onerror = function (e) {
        console.log(e)
        console.log('WebSocket连接失败')
        vm.reConnect()
      }
      this.websocket.onclose = function (e) {
        console.log(e)
        console.log('websocket关闭了')
        vm.reConnect()
      }
      this.websocket.onmessage = function (e) {
        console.log('websocket1接收到消息')
        // 心跳重置
        vm.heartReset()
        console.log(e)
        var json = JSON.parse(e.data)
        const message = json.webSocketMessage
        if (json.type === 'message') {
          vm.$Notice.success({
            title: '收到消息',
            desc: '用户1 收到了来自用户 ' + message.uid + ' 的消息'
          })
          vm.message1.unshift(message.sendMsg)
        }
      }
    },
    initWebSoctet2 () {
      const vm = this
      this.webSocket2 = new WebSocket(webSocketUrl + '/websocket/2/1')
      this.webSocket2.onopen = function (e) {
        setInterval(() => {
          vm.webSocket2.send('ping')
        }, 30000)
        console.log('WebSocket2连接成功')
      }
      this.webSocket2.onerror = function (e) {
        console.log('WebSocket2连接失败')
      }
      this.webSocket2.onclose = function (e) {
        console.log('websocket2关闭了')
      }
      this.webSocket2.onmessage = function (e) {
        console.log('websocket2接收到消息')
        console.log(e)
        var json = JSON.parse(e.data)
        const message = json.webSocketMessage
        if (json.type === 'message') {
          vm.$Notice.success({
            title: '收到消息',
            desc: '用户2 收到了来自用户 ' + message.uid + ' 的消息'
          })
          vm.message2.unshift(message.sendMsg)
        }
      }
    },
    // webSocket重连
    reConnect () {
      if (this.isConnect) {
        return
      }
      this.isConnect = true
      // 20秒重连一次
      setTimeout(() => {
        this.initWebSoctet()
        this.isConnect = false
      }, 20000)
    },
    // websocket心跳消息重置
    heartReset () {
      clearTimeout(this.timeoutCheck)
      clearTimeout(this.timeoutClose)
      this.heartCheckStart()
    },
    // websocket心跳发送
    heartCheckStart () {
      this.timeoutCheck = setTimeout(() => {
        this.websocket.send('ping')
        this.timeoutClose = setTimeout(() => {
          this.websocket.close()
        }, 30000)
      }, 30000)
    },
    ttt () {
      restApi.ttt().then(data => {
        alert(data)
      })
    },
    logout () {
      this.$store.commit('clearUser', null)
      this.$router.push('/login')
    },
    search1 () {
      if (this.sendMessage1) {
        this.websocket.send(JSON.stringify({
          uid: '1',
          sid: '2',
          sendMsg: this.sendMessage1
        }))
        this.sendMessage1 = ''
      }
    },
    search2 () {
      if (this.sendMessage2) {
        this.webSocket2.send(JSON.stringify({
          uid: '2',
          sid: '1',
          sendMsg: this.sendMessage2
        }))
        this.sendMessage2 = ''
      }
    },
    toWebsocketMsg () {
      this.webSocket2.send(JSON.stringify({
        uid: '2',
        sid: '1',
        sendMsg: '111111111'
      }))
      this.sendMessage2 = ''
    }
  },
  mounted () {
    this.initWebSoctet()
    this.initWebSoctet2()
  }
}
</script>
