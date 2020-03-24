<template>
  <div class="detail">
    <!-- 设置一个头部导航 -->
    <van-nav-bar fixed left-arrow class="loginnav" @click-left="$router.back()" title="文章详情" />
    <!-- 完成标题区域 -->
    <h2>{{detatilObj.title}}</h2>
    <!-- 作者信息 -->
    <van-cell>
      <template slot="title">
        <div class="autBox">
            <div class="autImg">
            <img :src="detatilObj.aut_photo" alt="">
          </div>
          <div class="autMsg">
            <div>{{detatilObj.aut_name}}</div>
            <div>{{detatilObj.pubdate | timefilter}}</div>
          </div>
          <div class="followed">
            <van-button @click="followed" icon="plus" v-if="detatilObj.is_followed === false" type="info">关注</van-button>
            <van-button @click="unfollowde" icon="plus" v-else type="info">已关注</van-button>
          </div>
        </div>
      </template>
    </van-cell>
    <!-- 文章内容 -->
    <van-cell>
      <template slot="title">
        <div v-html="detatilObj.content"></div>
      </template>
    </van-cell>
    <!-- 点赞&不喜欢 -->
    <div class="btns">
      <van-button @click="addzan" plain round :type="detatilObj.attitude === 1 ?'danger' : 'default'" class="btn">
        <van-icon name="like" />&nbsp;&nbsp;&nbsp;&nbsp;点赞</van-button>
      <van-button @click="dislike" plain round :type="detatilObj.attitude === 0 ?'danger' : 'default'" class="btn">
        <van-icon name="delete" />&nbsp;&nbsp;&nbsp;&nbsp;不喜欢</van-button>
    </div>
    <!-- 文章评论区域 -->
    <van-cell title="文章评论"></van-cell>
    <!-- 评论结构 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment :showReplycom="true" @showReply="replyshow=$event" v-for="(item, index) in commentList" :key="index" :data='item' />
    </van-list>
    <!-- 添加评论区域 -->
    <write :isreply="false" @addcomment="addcomment"/>
    <!-- 回复弹出框 -->
    <reply v-model="replyshow" />
  </div>
</template>

<script>
import comment from './components/comment'
import write from './components/write'
import reply from './components/reply'
// 导入操作文章详情的方法
import { apiGetArticles, apiNolike, apilike, apidislike, apiNodislike, apigetcomment } from '../../api/articles.js'
// 导入操作关注用户的方法
import { apifollowed, apiUnfollowed } from '../../api/user.js'
export default {
  components: {
    comment,
    write,
    reply
  },
  data () {
    return {
      // 文章id
      artid: 0,
      // 文章详情数据
      detatilObj: {},
      // list加载状态
      loading: false,
      // 加载完成的状态
      finished: false,
      // 分页的标识,第一页不用传
      offset: null,
      // 结束的id
      endid: 0,
      // 评论的数据源
      commentList: [],
      // 控制回复面板的显示和隐藏
      replyshow: false
    }
  },
  methods: {
    // 根据文章id发送请求到服务器
    async getArticleDetail () {
      let res = await apiGetArticles(this.artid)
      window.console.log(res)
      // 保存用户信息
      this.detatilObj = res.data.data
    },
    // 关注作者
    async followed () {
      let autid = this.detatilObj.aut_id
      try {
        // 发送关注请求
        await apifollowed(autid)
        // window.console.log(res)
        // 手动设置关注属性为true
        this.detatilObj.is_followed = true
        // 提示用户关注成功
        this.$toast.success('关注用户成功')
      } catch {
        this.$toast.fail('出错了')
      }
    },
    // 取关作者
    async unfollowde () {
      // 获取作者id
      let autid = this.detatilObj.aut_id
      await apiUnfollowed(autid)
      // 手动设置关注属性为true
      this.detatilObj.is_followed = false
      // 提示用户关注成功
      this.$toast.success('取消关注用户成功')
    },
    // 点赞的方法
    async addzan () {
      let attitude = this.detatilObj.attitude
      // 判断用户对文章的态度
      if (attitude === 1) {
        // 态度如果为1 取消点赞
        // 调用取消对文章点赞接口
        await apiNolike(this.artid)
        // 手动设置态度为-1
        this.detatilObj.attitude = -1
      } else {
        // 进行点赞
        await apilike(this.artid)
        // 手动设置
        this.detatilObj.attitude = 1
      }
    },
    // 不喜欢的方法
    async dislike () {
      let attitude = this.detatilObj.attitude
      // 判断用户对文章的态度
      if (attitude === 0) {
        // 态度如果为0 取消不喜欢
        // 调用取消对文章不喜欢接口
        apiNodislike(this.artid)
        // 手动设置态度为-1
        this.detatilObj.attitude = -1
      } else {
        // 进行不喜欢
        await apidislike(this.artid)
        // 手动设置
        this.detatilObj.attitude = 0
      }
    },
    // list 方法
    async onLoad () {
      // 在 list 的 onload 事件中，请求服务器中的评论数据
      let res = await apigetcomment({
        artid: this.artid,
        offset: this.offset
      })
      window.console.log(res)
      // 保存数据源
      this.commentList = [...this.commentList, ...res.data.data.results]
      this.offset = res.data.data.last_id
      this.endid = res.data.data.end_id
      // 上拉加载更多
      this.loading = false
      // 判断
      if (this.offset === this.endid) {
        this.finished = true
      }
    },
    // 添加评论的方法
    addcomment (comments) {
      // 将返回的评论数据渲染到页面上
      this.commentList.unshift(comments)
    }
  },
  created () {
    // 获取文章id
    this.artid = this.$route.params.artid
    // 根据文章id发送请求到服务器
    this.getArticleDetail()
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
.detail {
  margin-top: 46px;
  margin-bottom: 54px;
  h2 {
    font-weight: 400;
    text-align: center;
    margin: 66px;
  }
  .autBox {
    display: flex;
    .autImg {
      margin-top: 5px;
      img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
   }
    .autMsg {
      flex: 1;
      margin-left: 20px;
    }
  }
  .btns {
    text-align: center;
    .btn {
      margin: 20px;
    }
  }
}
</style>
