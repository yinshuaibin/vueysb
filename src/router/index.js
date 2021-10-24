import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'view-design'
import store from '@/store/index.js'
const Home = () => import('../views/Home.vue')
const Main = () => import('../views/Main.vue')
const title1 = () => import('../views/title1.vue')
const title2 = () => import('../views/title2.vue')
const login = () => import('../views/login/index.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: Main,
    children: [
      {
        path: 'home',
        component: Home,
        meta: { title: '主页' }
      },
      {
        path: 'title1',
        component: title1,
        meta: { title: 'title1' }
      },
      {
        path: 'title2',
        component: title2,
        meta: { title: 'title2' }
      }
    ]
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
  const token = store.getters.getToken
  const path = to.path.replace('/', '')
  if (!token && path !== 'login') {
    next('/login')
    return
  }
  iView.LoadingBar.start()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
