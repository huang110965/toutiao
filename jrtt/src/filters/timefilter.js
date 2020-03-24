// 导入vue
import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'
// 导入插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入语言包
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
// 定义全局过滤器
Vue.filter('timefilter', function (str) {
  // 使用全局过滤器的数据
  return dayjs().from(dayjs(str))
})
