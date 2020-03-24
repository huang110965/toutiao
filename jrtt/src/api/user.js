// 导入http.js
import http from '../utils/http.js'

// 暴露接口方法
// 用户登录
function apiLogin ({ mobile, code }) {
  return http({
    url: '/authorizations',
    method: 'post',
    data: {
      mobile: mobile,
      code: code
    }
  })
}
// 关注用户
function apifollowed (autid) {
  return http({
    url: '/user/followings',
    method: 'post',
    data: {
      target: autid
    }
  })
}
// 取关用户
function apiUnfollowed (autid) {
  return http({
    url: `/user/followings/${autid}`,
    method: 'DELETE'
  })
}
// 获取用户自己信息
function apigetuser () {
  return http({
    url: '/user'

  })
}
// 获取用户个人资料
function apimessage () {
  return http({
    url: '/user/profile'
  })
}
// 编辑用户个人资料
function apiSetuser ({ name, gender, birthday, intro }) {
  return http({
    url: '/user/profile',
    method: 'PATCH',
    data: {
      name: name,
      gender: gender,
      birthday: birthday,
      intro: intro
    }
  })
}
// 编辑用户照片资料
function apiSetImg (photo) {
  // photo：是一个图片对象
  // 将 photo 转为一个 formData
  // 1.0 创建一个 formData 对象
  let fd = new FormData()
  fd.append('photo', photo)
  return http({
    url: '/user/photo',
    method: 'PATCH',
    data: fd
  })
}
// 将方法暴露出去
export {
  apiLogin,
  apifollowed,
  apiUnfollowed,
  apigetuser,
  apimessage,
  apiSetuser,
  apiSetImg
}
