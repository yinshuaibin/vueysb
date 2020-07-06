<template>
  <div class="home">
    <img @click="ttt()" alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import restApi from '@/api/restApi'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    ttt () {
      restApi.ttt().then(data => {
        console.log(data)
      })
    }
  }
}
</script>
