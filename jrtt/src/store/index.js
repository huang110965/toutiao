import Vue from 'vue'
import Vuex from 'vuex'
// 导入操作localstorage 的方法
import { getLocal, setLocal } from '../utils/mylocal.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 定义一个变量用来保存用户信息
    user: getLocal('userInfo') || {}
  },
  // 修改数据的方法
  mutations: {
    // 定义一个方法给 user 赋值
    setUser (state, payload) {
      // state 对应的是 vuex 中的 state
      // payload 对应的是传过来的参数
      // 给user赋值
      state.user = payload
      // 将token &refresh_token 也保存到localstorage
      setLocal('userInfo', payload)
    }
  }
})
