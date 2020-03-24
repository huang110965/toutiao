<template>
  <div class="searchresult">
    <!-- 顶部导航 -->
    <van-nav-bar fixed left-arrow class="loginnav" @click-left="back" title="搜索结果" />
    <!-- 新闻数据 -->
       <!-- 添加一个下拉刷新组件 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- 添加 List: 完成上拉加载更多 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
          <van-cell @click="todetail(item.art_id)" v-for="(item, index) in searchResult" :key="index">
            <template slot="title">
              <!-- 设置文章的标题 -->
               <h3>{{item.title}}</h3>
               <!-- 设置文章的插图(三张) -->
               <van-grid v-if="item.cover.type > 0" :border="false" :column-num="3">
                 <van-grid-item v-for="(imgitem, imgindex) in item.cover.images" :key="imgindex">
                   <van-image :src="imgitem" />
                 </van-grid-item>
               </van-grid>
               <!-- 作用评论时间 -->
               <div class="searchBar">
                 <span>{{item.aut_name}}</span>
                 <span>{{item.comm_count}}评论</span>
                 <span>{{item.pubdate | timefilter}}</span>
               </div>
                <!-- 其他操作结构 -->
               <van-grid :column-num="3">
                 <van-grid-item @click="comment" icon="comment-o" text="评论" />
                 <van-grid-item @click="zan" icon="like-o" text="点赞" />
                 <van-grid-item @click="share" icon="share" text="分享" />
               </van-grid>
            </template>
          </van-cell>
      </van-list>
   </van-pull-refresh>
  </div>
</template>

<script>
// 导入搜索结果 接口
import { apiGetSearch } from '../../api/search.js'
export default {
  data () {
    return {
      // 下拉刷新状态
      isLoading: false,
      // 上拉加载状态
      loading: false,
      // 完成加载状态
      finished: false,
      // 数据
      list: [],
      // 搜索关键字
      key: '',
      // 当前页
      page: 0,
      // 每页数量
      perpage: 10,
      // 搜索的结果
      searchResult: []
    }
  },
  methods: {
    // 返回上一个路由
    back () {
      this.$router.back()
    },
    // pullrefr esh 的事件：当组件被下拉时执行
    onRefresh () {
      // window.console.log('onRefresh')
      // 重新加载数据
      this.onLoad()
      this.isLoading = false
    },
    async onLoad () {
      this.page++
      // window.console.log('onLoad')
      // 请求服务器的数据
      let res = await apiGetSearch({
        page: this.page,
        perpage: this.perpage,
        q: this.key
      })
      window.console.log(res)
      this.searchResult = [...this.searchResult, ...res.data.data.results]
      if (res.data.data.results.length <= 0) {
        // 将 list 的加载完毕状态设置为 true
        this.finished = true
      }
      // 将请求状态设置为false
      this.loading = false
    },
    // 评论点击事件
    comment () {
      // 进行登录的验证
      // 得到用户的登录信息
      let user = this.$store.state.user
      // 判断
      if (!user.token) {
        // 未登录
        this.$router.push('/login')
        return
      }
      window.console.log('进行了评论')
    },
    // 点赞的方法
    zan () {
      // 进行登录验证: 调用全局的登录验证方法
      if (this.$login() === false) {
        return // 后续代码不执行
      }
      window.console.log('点赞')
    },
    // 分享的方法
    share () {
      if (this.$login() === false) {
        return // 后续代码不执行
      }
      window.console.log('分享')
    },
    // 跳转到文章详情页面
    todetail (artid) {
      this.$router.push(`/detail/${artid}`)
    }
  },
  created () {
    // 获取动态路由
    this.key = this.$route.params.mykey
    // window.console.log(this.key)
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
.searchresult {
  margin-top: 46px;
}
.van-grid-item__content {
  flex-direction: row;
  // align-items: center;
}
.van-grid-item__icon+.van-grid-item__text {
    margin: 0;
    margin-left: 8px;
}
.van-grid-item__icon {
    font-size: 18px;
}
.searchBar {
  span {
    margin-right: 10px;
  }
}
</style>
