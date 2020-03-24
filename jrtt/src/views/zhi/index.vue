<template>
  <div class="zhi">
       <!-- 设置一个头部导航 -->
    <van-nav-bar fixed left-arrow class="loginnav" @click-left="$router.back()" title="小智同学" />
    <!-- 聊天区域 -->
    <div class="chatbox">
        <div class="chat">
            <div class="img">
                <img src="https://www.baidu.com/img/bd_logo1.png" alt="">
            </div>
            <div class="chatImg">你好啊</div>
        </div>
        <div class="chat person">
            <div class="img">
                <img src="https://www.baidu.com/img/bd_logo1.png" alt="">
            </div>
            <div class="chatImg">你好啊</div>
        </div>
        <div class="chat">
            <div class="img">
                <img src="https://www.baidu.com/img/bd_logo1.png" alt="">
            </div>
            <div class="chatImg">你好啊</div>
        </div>
    </div>
    <!-- 底部 -->
    <van-search background="#ccc" class="footer" v-model="value" show-action @search="onSearch" >
        <template slot="left-icon">
           <van-icon name="edit" />
        </template>
        <template slot="action">
            <div @click="onSearch">发送</div>
        </template>
    </van-search>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onSearch () {
      window.console.log('onSearch')
    }
  }
}
</script>

<style lang="less">
.loginnav {
  background-color: #3194fa;
  .van-nav-bar__title {
    color: white;
  }
}
.van-nav-bar .van-icon {
  color: #fff;
}
.footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
}
.chatbox {
    position: fixed;
    left: 0;
    top: 46px;
    bottom: 54px;
    width: 100%;
    padding: 20px 0px 0 0px;
    background-color: #f5f7f9;
    .chat {
        display: flex;
        align-items: center;
        padding: 0 10px;
        margin-bottom: 20px;
        background-color: #fff;
        .img {
            margin-right: 10px;
            img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
        }
        .chatImg {
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #ddd;
            background-color: #e0effb;
            border-radius: 8px;
            padding: 8px;
        }
    }
    .person {
        flex-direction: row-reverse;
        .img {
            margin-left: 10px;
        }
    }
}
</style>
