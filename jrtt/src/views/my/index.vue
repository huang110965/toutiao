<template>
  <div class="my">
    <!-- 用户信息 -->
      <div class="userInfo" v-if="isLogin">
        <div class="msg">
          <div class="userImg" @click="$router.push('/user')">
            <img :src="getuser.photo" alt="">
          </div>
          <div class="username">{{getuser.name}}</div>
          <div class="tread">
            <div>今日阅读</div>
            <div>1分钟</div>
          </div>
        </div>
        <!-- 动态&关注&粉丝 -->
        <div class="fansbox">
          <div class="dongtai">
            <div>{{getuser.art_count}}</div>
            <div>动态</div>
          </div>
          <div class="follow">
            <div>{{getuser.follow_count}}</div>
            <div>关注</div>
          </div>
          <div class="fans">
            <div>{{getuser.fans_count}}</div>
            <div>粉丝</div>
          </div>
        </div>
      </div>
      <div class="userInfo" v-else>
        <div class="box">
          <div class="usericon" @click="$router.push('./checklogin')">
            <van-icon class="user_icon" name="contact" />
          </div>
           <div class="tread">
            <div>今日阅读</div>
            <div>1分钟</div>
          </div>
        </div>
      </div>
      <!-- 收藏&历史&作业 区域 -->
      <van-grid :column-num="3">
        <van-grid-item text="收藏" >
          <template slot="icon">
            <van-icon color='#ed6667' name="star-o" />
          </template>
        </van-grid-item>
        <van-grid-item text="历史" >
          <template slot="icon">
            <van-icon color='#ff9d1f' name="clock-o" />
          </template>
        </van-grid-item>
        <van-grid-item text="作品" >
          <template slot="icon">
            <van-icon color="#678eff" name="records" />
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 消息区域 -->
      <van-cell-group class="message">
        <van-cell title="消息通知" is-link />
        <van-cell title="用户反馈" is-link />
        <van-cell @click="$router.push('/zhi')" title="小智同学" is-link />
      </van-cell-group>
  </div>
</template>

<script>
// 导入操作用户自己个人信息
import { apigetuser } from '../../api/user.js'
export default {
  data () {
    return {
      isLogin: false,
      // 保存用户信息
      getuser: {}
    }
  },
  async created () {
    // 判断用户是否登录
    let user = this.$store.state.user
    if (user.token) {
      this.isLogin = true
      // 请求服务器得到用户信息
      let res = await apigetuser()
      // window.console.log(res)
      this.getuser = res.data.data
    } else {
      this.isLogin = false
    }
  }
}
</script>

<style lang="less" scoped>
 .my {
   background-color: #f5f7f9;
   .userInfo {
   background-color: #3e9df8;
   padding: 30px 20px;
   .msg {
     display: flex;
     position: relative;
     .userImg {
       img {
         width: 50px;
         height: 50px;
         border-radius: 50%;
         margin: 0 20px;
       }
     }
     .username {
       color: #fff;
       font-size: 20px;
     }
   }
 }
 .tread {
       position: absolute;
       right: -20px;
       top: 10px;
       background-color:rgba(0, 0, 0, .3);
       border-radius: 50px 0 0 50px;
       padding: 5px 15px;
       div {
         font-size: 12px;
         color: #fff;
         text-align: center;
         padding-right: 10px;
       }
     }
 .box {
   height: 176px;
   .usericon {
     width: 60px;
     height: 60px;
     background-color: #fff;
     border-radius: 50%;
     margin: 30px auto;
     font-size: 40px;
     text-align: center;
     line-height: 60px;
     .user_icon {
       color: #3e9df8;
     }
   }
 }
 .fansbox {
   display: flex;
   margin-top: 20px;
   color: #fff;
   text-align: center;
   .dongtai {
     flex: 1;
   }
   .follow {
     flex: 1;
   }
   .fans {
     flex: 1;
   }

 }
//  消息通知
.message {
  margin-top: 20px;
}
.van-grid-item__icon-wrapper {
  .van-icon {
 font-size: 24px;
  }
}
 }
</style>
