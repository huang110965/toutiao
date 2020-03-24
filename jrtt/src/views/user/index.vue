<template>
  <div class="user">
      <!-- 设置一个头部导航 -->
    <van-nav-bar fixed left-arrow class="loginnav" @click-left="$router.back()" title="个人信息" right-text="保存" @click-right="save" />
    <!-- 设置头像区域 -->
    <van-cell-group>
    <van-cell @click="openImg" title="头像" is-link>
        <template slot="default">
            <img class="userimg" :src="userInfo.photo" alt="">
        </template>
    </van-cell>
    <van-cell title="昵称" @click="openNickName" is-link :value="userInfo.name" />
    <van-cell title="介绍" @click="openIntro" is-link :value="userintro.intro" />
     </van-cell-group>
    <div class="otherbox">
      <van-cell title="性别" @click="openGender" is-link :value="userInfo.gender?'女' : '男'" />
      <van-cell title="生日" is-link :value="userInfo.birthday" />
    </div>
    <!-- 昵称面板 -->
   <van-popup v-model="shownick" position="bottom" :style="{ height: '8%' }">
     <template>
       <van-field v-model="userInfo.name"  required />
     </template>
   </van-popup>
   <!-- 介绍面板 -->
   <van-popup v-model="showintro" position="bottom" :style="{ height: '8%' }">
     <template>
       <van-field v-model="userintro.intro"  required />
     </template>
   </van-popup>
   <!-- 性别面板 -->
   <van-popup v-model="showgender" position="bottom" :style="{ height: '8%' }">
     <template>
       <van-picker :columns="columns" @change="onChange" />
     </template>
   </van-popup>
   <!-- 头像面板 -->
   <van-popup :close-on-click-overlay="false" v-model="showimg" :style="{ width: '85%',borderRadius: '5px' }">
      <div class="imgbox">
        <div @click="openphoto">从相册中选择</div>
        <div style="display:none">
          <input type="file" ref="myfile" @change="imgChange">
        </div>
        <div>拍照</div>
        <div @click="showimg=false">取消</div>
      </div>
   </van-popup>

  </div>
</template>

<script>
// 导入Vue
import Vue from 'vue'
// 导入预览组件
import { ImagePreview } from 'vant'
import { apimessage, apigetuser, apiSetuser, apiSetImg } from '../../api/user.js'
// 使用这个组件
Vue.use(ImagePreview)
export default {
  data () {
    return {
      // 保存用户信息
      userInfo: {},
      userintro: {},
      // 昵称面板显示与隐藏
      shownick: false,
      // 介绍面板
      showintro: false,
      // 性别面板
      showgender: false,
      // 头像面板
      showimg: false,
      columns: ['杭州', '宁波', '温州', '嘉兴', '湖州']
    }
  },
  methods: {
    async save () {
      // window.console.log('save')
      try {
        // 发送请求到服务器
        await apiSetuser({
          name: this.userInfo.name,
          gender: this.userInfo.gender,
          birthday: this.userInfo.birthday,
          intro: this.userintro.intro
        })
        // 提示用户信息修改完成
        this.$toast.success('修改成功')
      } catch {
        this.$toast.fail('修改失败')
      }
    },
    // 打开昵称面板
    openNickName () {
      this.shownick = true
    },
    // 打开介绍面板
    openIntro () {
      this.showintro = true
    },
    // 打开性别面板
    openGender () {
      this.showgender = true
    },
    onChange (picker, value, index) {
      this.$toast(`当前值：${value}, 当前索引：${index}`)
    },
    // 打开头像面板
    openImg () {
      this.showimg = true
    },
    // 打开图片选择器
    openphoto () {
      // 得到file对象
      let myfile = this.$refs.myfile
      // 触发它的点击事件 打开图片选择器
      myfile.click()  
    },
    // 选中图片发生改变事件
    imgChange () {
      // window.console.log('change')
      // 得到file对象
      let file = this.$refs.myfile
      // 得到选中的图片
      let myfileImg = file.files[0]
      // 将图片的对象转为 base64 格式的字符串
      // 1.0 得到一个 fileReader 对象
      var reader = new FileReader()
      // 开始转换
      reader.readAsDataURL(myfileImg)
      // 设置转换完成的事件
      reader.addEventListener('load', () => {
        // 得到转换后的结果
        // console.log(reader.result)
        // 预览图片：图片的地址 & base64
        ImagePreview({
          images: [
            reader.result
          ],
          // 关闭时的回调函数
          onClose: this.myclose
        })
      })
    },
    // 预览框关闭时要执行的逻辑代码
    myclose () {
      // window.console.log('close')
      // 询问用户是否设置图片为头像
      this.$dialog.confirm({
        message: '是否将图片设置为头像?'
      }).then(async () => {
        // 得到图片对象
        let myfile = this.$refs.myfile.files[0]
        // 发送请求到服务器
        let res = await apiSetImg(myfile)
        window.console.log(res)
        // 3.0 将图片地址重新设置给头像
        this.userInfo.photo = res.data.data.photo
        // 关闭其他面板
        this.showimg = false
      }).catch(() => {
        // 关闭其他面板
        this.showimg = false
      })
    }
  },
  async created () {
    // 获取用户个人信息
    let res = await apimessage()
    // window.console.log(res)
    this.userInfo = res.data.data
    let resUser = await apigetuser()
    // window.console.log(resUser)
    this.userintro = resUser.data.data
  }
}
</script>

<style lang="less">
#app,html,body {
  height: 100%;
  width: 100%;
}
.user {
    margin-top: 46px;
    background-color: #f5f7f9;
    height: 100%;
.loginnav {
  background-color: #3194fa;
  .van-nav-bar__title {
    color: white;
  }
}
.van-nav-bar .van-icon,.van-nav-bar__text {
  color: #fff;
}
.van-nav-bar__text:active {
    background-color: #3194fa;
    color: #ccc;
}
.userimg {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.otherbox {
  height: 88px;
  margin-top: 20px;
}
}
.imgbox {
  text-align: center;
  div {
    line-height: 44px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
}
</style>
