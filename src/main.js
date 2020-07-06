import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from './utils/moment.js'
import lodash from './utils/lodash.js'
import VueParticles from 'vue-particles'
Vue.config.productionTip = false

Vue.use(VueParticles)

Vue.use(iView)
Vue.use(ElementUI)
Vue.use(moment)
Vue.use(lodash)

Vue.prototype.$Message.config({
  top: 150,
  duration: 4
})

Vue.prototype.$Notice.config({
  top: 60,
  duration: 4
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
