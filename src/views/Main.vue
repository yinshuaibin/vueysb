<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="content-box" >
            <div class="content">
                <transition name="move" mode="out-in">
                    <!-- <keep-alive> -->
                        <router-view></router-view>
                    <!-- </keep-alive> -->
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>
<script>
import vHead from '../components/Header.vue'
export default {
  data () {
    return {
      collapse: false
    }
  },
  components: {
    vHead
  }
}
</script>
