import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant // 导入图片的懒加载
import Vant, { Lazyload } from 'vant'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import 'dayjs/locale/zh-cn'
// 导入dayjs
// import dayjs from 'dayjs'

import 'vant/lib/index.css'
// 导入iconfont 图标样式
import './style/iconfont.css'
// 导入全局过滤器
import './filters/timefilter'
// 导入登录验证的插件
import MyPlugin from './plugin/myplugin.js'

Vue.use(Lazyload)
// 使用 vant
Vue.use(Vant)
Vue.use(MyPlugin)
Vue.config.productionTip = false

// // 封装一个全局的登录验证方法
// Vue.prototype.$login = function () {
//   // 得到用户信息
//   let user = store.state.user
//   // 判断
//   if (!user.token) {
//     // 未登录 跳转到登录页面
//     this.$router.push('/login')
//     return false // 后续代码不执行
//   }
//   return true // 用户已经登录过，继续执行后续的代码
// }

// dayjs.extend(relativeTime)

// let res = dayjs().locale('zh-cn').from(dayjs('1990'))
// window.console.log(res)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
