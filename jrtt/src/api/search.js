// 用来处理所有与搜索相关的网络请求
// 导入http.js
import http from '../utils/http.js'

// 获取联想建议（自动补全）
function apiThink (q) {
  return http({
    url: `/suggestion?q=${q}`
  })
}
// 获取搜索结果
function apiGetSearch ({ page, perpage, q }) {
  return http({
    url: `/search?page=${page}&per_page=${perpage}&q=${q}`
  })
}
// 按需导出
export {
  apiThink,
  apiGetSearch
}
