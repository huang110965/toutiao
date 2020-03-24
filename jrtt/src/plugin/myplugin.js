// 导入store
import store from '../store'
// 导入路由
import router from '../router'
// 创建一个插件对象
var MyPlugin = {}
// 给插件对象添加一个install 方法
MyPlugin.install = function (Vue) {
  // 给Vue添加一个实例方法
  Vue.prototype.$login = function () {
    // 进行登录验证
    let user = store.state.user
    // 判断
    if (!user.token) {
      router.push('/checklogin')
      return false
    }
    return true
  }
}
// 导出插件对象
export default MyPlugin
