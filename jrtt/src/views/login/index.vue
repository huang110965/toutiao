<template>
  <div>
      <!-- 头部导航 -->
    <van-nav-bar class="loginnav" title="登录" />
<!-- 输入框 -->
<van-cell-group>
  <van-field v-model="obj.mobile" left-icon="contact" placeholder="请输入手机号" :error-message="errMsg.mobile">
      <template slot="left-icon">
          <i class="iconfont icon-mobile"></i>
      </template>
  </van-field>
  <van-field v-model="obj.code" left-icon="contact"  placeholder="请输入验证码" :error-message="errMsg.code">
       <template slot="left-icon">
          <i class="iconfont icon-locka"></i>
      </template>
       <van-button class="mybtn" slot="button" round color="#bababa" size="mini" type="primary">发送验证码</van-button>
  </van-field>
</van-cell-group>
<!-- 登录按钮 -->
<div class="myloginbtn">
  <van-button type="info" :loading="btnloading" size="large" @click="login">登录</van-button>
</div>
  </div>
</template>

<script>
// 导入登录的方法
import { apiLogin } from '../../api/user'
export default {
  data () {
    return {
      obj: {
        mobile: '13911111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      },
      btnloading: false
    }
  },
  methods: {
    // 处理登录逻辑
    login () {
      if (!this.yanzheng()) {
        // 如果不通过,后续代码不执行
        return
      }
      // 将登录状态设置为 true
      this.btnloading = true
      window.setTimeout(async () => {
        try {
        // 执行后续代码
          let res = await apiLogin(this.obj)
          // window.console.log(res)
          // 登录成功,需要将用户信息保存到 vuex中
          this.$store.commit('setUser', res.data.data) // token &refresh_token
          // window.console.log(this.$route)
          // 判断
          if (this.$route.path === '/login') {
            // 跳转到首页
            this.$router.push('/home')
          } else {
            // 用过返回上一个页面
            this.$router.back()
          }
        } catch {
          // window.console.log('登录失败')
          this.$toast.fail('登录失败')
        }
        // 将登录状态设置为 false
        this.btnloading = false
      }, 1000)
    },
    yanzheng () {
      // 创建一个结果数组
      let resArr = []
      // 验证手机号是否合格
      if (this.obj.mobile.trim().length !== 11) {
        // 验证不通过
        this.errMsg.mobile = '手机号格式不正确'
        // 向数组中添加 false
        resArr.push(false)
      } else {
        // 验证通过
        this.errMsg.mobile = ''
        // 向数组中添加 true
        resArr.push(true)
      }
      // 验证验证码
      if (this.obj.code.trim().length !== 6) {
        // 验证不通过
        this.errMsg.code = '验证码格式不正确'
        // 向数组中添加 false
        resArr.push(false)
      } else {
        // 验证通过
        this.errMsg.code = ''
        // 向数组中添加 true
        resArr.push(true)
      }
      // 执行后续代码:判断resARR 数组中是否存在false ,r如果存在不执行
      // 返回resArr 中是否包含false 如果包含说明验证不通过,如果不包含,说明验证通过
      return !resArr.includes(false)
    }
  }
}
</script>

<style lang='less'>
  .loginnav{
      background-color: #3194fa;
      .van-nav-bar__title{
          color: white;
      }
  }
  .mybtn{
    color: white;
    padding: 0px 5px;
  }
  .myloginbtn{
    margin: 20px 10px;
  }

</style>
