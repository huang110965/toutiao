import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import UseVant from '../views/usevant'
// 导入 登录 组件
// import Login from '../views/login'
const Login = () => import('../views/login')
// 导入 home 组件: => goes to (.net)
const Home = () => import('../views/home')
// 导入 layout
const Layout = () => import('../views/layout')
// 导入 my
const My = () => import('../views/my')
// 导入search
const Search = () => import('../views/search')
// 导入searchResult
const SearchResult = () => import('../views/searchResult')
// 导入文章详情
const Detail = () => import('../views/detail')
// 导入个人详情
const User = () => import('../views/user')
// 添加小智同学详情
const Zhi = () => import('../views/zhi')

Vue.use(VueRouter)

// 创建一个路由对象
const router = new VueRouter({
  // 路由规则
  routes: [
    // 使用 vant 的路由
    {
      path: '/usevant',
      component: UseVant
    },
    // 登录路由
    {
      path: '/login',
      component: Login
    },
    // 验证登录路由
    {
      path: '/checklogin',
      component: Login
    },
    // 如果用户请求根目录，让页面跳转到 home 中
    // 将根目录重定向到 home 中
    {
      path: '/',
      redirect: '/home'
    },
    // 添加一个 layout 路由
    {
      path: '/layout',
      component: Layout,
      // 添加 children
      children: [
        // 添加首页路由
        { path: '/home', component: Home },
        // 添加 my 路由
        { path: '/my', component: My },
        // 添加search路由
        { path: '/search', component: Search }
      ]
    },
    // 添加一个searchResult路由
    {
      path: '/searchResult/:mykey',
      component: SearchResult
    },
    // 添加文章详情路由
    {
      path: '/detail/:artid',
      component: Detail
    },
    // 添加个人详情路由
    {
      path: '/user',
      component: User
    },
    // 添加小智同学路由
    {
      path: '/zhi',
      component: Zhi
    }

  ]
})

// 暴露给外界
export default router
