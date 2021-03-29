import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'view-design'
import store from '@/store/index.js'
const Home = () => import('../views/Home.vue')
const login = () => import('../views/login/index.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/download',
    name: 'download',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/test/download.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  iView.LoadingBar.start()
  next()
  if (to.path === '/') {
    if (store.getters.getToken && store.getters.getUser) {
      router.push('home')
    }
  }
  if (!store.getters.getToken) {
    router.push('/')
  }
})
router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
