// 用来处理所有与频道相关的网络请求
// 导入http.js
import http from '../utils/http.js'

// 得到频道数据
function apiGetChannel () {
  return http({
    url: '/user/channels'
  })
}
// 得到全部的频道数据
function apiGetAllChannel () {
  return http({
    url: '/channels'
  })
}
// 重置频道数据
function apiResetChannel (channels) {
  return http({
    url: 'user/channels',
    method: 'put',
    data: {
      channels: channels
    }
  })
}

// 暴露方法
export {
  apiGetChannel,
  apiGetAllChannel,
  apiResetChannel
}
