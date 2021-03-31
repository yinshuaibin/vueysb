<template>
  <div style="margin-top:15px">
    <Button type="primary" @click="ttt">测试重复操作</Button>
    <Button style="float:right" type="primary" @click="logout">退出</Button>
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

export default {
  name: 'Home',
  components: {
    pic
  },
  methods: {
    ttt () {
      restApi.ttt().then(data => {
        alert(data)
      })
    },
    logout () {
      this.$store.commit('clearUser', null)
      this.$router.push('/')
    }
  }
}
</script>
