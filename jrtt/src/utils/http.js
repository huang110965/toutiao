// 导入 axios
import axios from 'axios'
// 导入 store
import store from '../store'
// 导入jsonbigint
import jsonbig from 'json-bigint'
// 创建一个axios对象
const instance = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  transformResponse: [function (data) {
    try {
      // window.console.log(data)
      return jsonbig.parse(data)
    } catch {
      // 请求失败 JSON.parse其实是axios内部的默认处理方式
      return JSON.parse(data)
    }
  }]
})

// 再创建一个axios 实例 :用来在 instance 中的响应拦截器中发送请求
const instance2 = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})

// 设置请求拦截器
// 添加一个请求拦截器
instance.interceptors.request.use(function (config) {
  // 判断用户是否登录
  // 取出用户信息
  let user = store.state.user
  // 判断是否存在token
  if (user.token) {
    // 在请求头中添加token
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 在发送请求之前做些什么
  // window.console.log("请求发送之前");
  // window.console.log(config);
  return config
}, function (error) {
  // 处理请求错误
  return Promise.reject(error)
})
// 添加一个响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做些什么
  // window.console.log('响应数据获取之后');
  // window.console.log(response);
  // 这里可以把data 直接获取到
  // 后面就不用多加一个data了
  return response
}, async function (error) {
  // 处理请求错误
  // window.console.dir(error)
  // 判断状态是否为 401:说明 token 过期
  if (error.response.status === 401) {
    // 得到 refresh_token
    let user = store.state.user
    let refreshtoken = user.refresh_token
    // 将参数提交到服务器得到新的 token
    let res = await instance2({
      url: '/authorizations',
      method: 'put',
      headers: {
        Authorization: `Bearer ${refreshtoken}`
      }
    })
    // window.console.log(res)
    // 将新的token 保存
    let newToken = res.data.data.token
    // 更新token
    user.token = newToken
    // 将 user 重新保存到vuex中
    store.commit('setUser', user)
    // token 就已经更新了，继续请求未完成的请求
    // return 的意思是将新的请求的结果交给响应拦截器
    return instance(error.config) // 未完成的请求的参数
  }
  return Promise.reject(error)
})
// 暴露instance
export default instance
