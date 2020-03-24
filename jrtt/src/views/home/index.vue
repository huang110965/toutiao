<template>
  <div class="home">
    <!-- 头部导航 -->
    <van-nav-bar fixed class="loginnav" title="首页" />
    <!-- 频道区域  -->
    <!-- v-model：指定当前 tab 选中的 tab 项的下标 -->
    <!-- title：标签页的名称 -->
    <!-- 内容1：标签页下方的内容 -->
    <van-tabs v-model=" ">
      <van-tab v-for="(item, index) in channelList" :key="index" :title="item.name">
        <!-- 添加一个下拉刷新组件 -->
        <van-pull-refresh v-model="item.isloading" @refresh="onRefresh">
          <!-- 添加 List: 完成上拉加载更多 -->
          <van-list v-model="item.loading" :finished="item.finished" finished-text="没有更多了"
            @load="onLoad">
            {{ active }}
            <van-cell class="mycell" v-for="(subitem, subindex) in item.list" :key="subindex">
              <template slot="title">
                 <!-- 设置文章标题 -->
                 <div>{{subitem.title}}</div>
                 <!-- 设置文章的插图(三张) -->
                 <van-grid v-if="subitem.cover.type>0" :border="false" :column-num="3">
                    <van-grid-item v-for="(imgitem, imgindex) in subitem.cover.images" :key="imgindex">
                      <van-image lazy-load :src="imgitem" />
                    </van-grid-item>
                 </van-grid>
                 <!-- 用户名评论 时间-->
                 <div class="otherbox">
                   <div class="other">
                   <span>{{subitem.aut_name}}</span>
                   <span>{{subitem.comm_count}}评论</span>
                   <span>{{subitem.pubdate | timefilter}}</span>
                 </div>
                 <div class="more">
                   <van-icon name="cross" @click="openmore(subitem.art_id)"/>
                 </div>
                 </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <div class="mymenu">
      <van-icon @click="showChannels" name="wap-nav" />
    </div>
    <!-- 频道弹出层 -->
    <mypop v-model="show" :channelList="channelList" :active.sync="active" />
    <!-- 更多弹出层 -->
    <more v-model="moreshow" :artid="artid" @delArticle="delArticle" />
  </div>
</template>

<script>
import mypop from './components/mypop.vue'
// 导入操作频道的方法
import { apiGetChannel } from '../../api/channels.js'
// 导入 操作 文章的 方法
import { addGetArticles } from '../../api/articles.js'
// 导入操作localstorage 的方法
import { getLocal } from '../../utils/mylocal.js'
// 导入更多组件
import more from './components/more.vue'
export default {
  components: {
    // 注册组件
    mypop,
    more
  },
  data () {
    return {
      // tab 的激活项
      active: 0,
      // 用来设置list组件是否处于加载状态
      // loading: false,
      // 用来设置 List 组件中的数据是否全部加载完毕
      // finished: false,
      // pullrefresh 的 isLoading：用来设置 pullrefresh 组件的加载状态
      // isLoading: false,
      // 定义一个要显示的数据源
      // list: [],
      // 定义一个频道列表
      channelList: [],
      // 是否显示频道弹出层的显示和隐藏
      show: false,
      // 是否显示更多弹出层的显示和隐藏
      moreshow: false,
      // 当前要操作的文章id
      artid: 0
    }
  },
  methods: {
    // list 的事件：当 list 组件被加载时会执行
    async onLoad () {
      // 得到当前频道
      let currentChannle = this.channelList[this.active]
      // 得到当前频道对应的 id
      let id = currentChannle.id
      // 得到当前频道下的文章数据
      let res = await addGetArticles({
        channelid: id
      })
      window.console.log(res)
      // 将文章列表数据保存到当前频道下的list属性中
      currentChannle.list = [...currentChannle.list, ...res.data.data.results]
      window.console.log(res.data.data.results)
      // 打印下频道数据
      // window.console.log(this.channelList)
      if (res.data.data.results.length === 0) {
        // 将 list 的加载完毕状态设置为 true
        currentChannle.finished = true
      }
      // 手动设置loading 为false
      currentChannle.loading = false
    },
    // pullrefresh 的事件：当组件被下拉时执行
    onRefresh () {
      // 得到当前频道数据
      let currentChannle = this.channelList[this.active]
      // 清除当前频道中的所有的数据
      currentChannle.loading = false
      currentChannle.finished = false
      currentChannle.isloading = false
      currentChannle.list = []
      // 重新加载数据
      this.onLoad()
    },
    addOtherProp () {
      // 遍历数组
      this.channelList.forEach(item => {
        // // list 组件的加载状态
        // item.loading = false
        // // list 组件的完毕状态
        // item.finished = false
        // // pullrefresh 组件的下拉状态
        // item.isloading = false
        // // 显示的文章数据源
        // item.list = []
        // 应该通过$set 添加属性
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'isloading', false)
        this.$set(item, 'list', [])
      })
    },
    // 频道弹出层
    showChannels () {
      this.show = true
    },
    // 点击叉叉弹出层
    openmore (artid) {
      // window.console.log(artid)
      this.moreshow = true
      // 获取文章id
      this.artid = artid
    },
    // 删除不感兴趣的文章
    delArticle () {
      // 得到数据源,当前选中频道下的list
      let dataList = this.channelList[this.active].list
      // 得到不感兴趣的文章 id: this.artid
      // 根据 id 从 dataList 中删除数据
      dataList.forEach((item, index) => {
        if (item.art_id === this.artid) {
          dataList.splice(index, 1)
        }
      })
    }
  },
  // 打开页面是得到频道数据
  async created () {
    // 判断用户是否登录  $store 中的 user 下面的 token 是否存在数据
    // 得到用户信息
    let user = this.$store.state.user
    try {
      // 判断是否登录
      if (user.token) {
        // 直接去服务器中得到频道数据
        // 得到频道数据
        let res = await apiGetChannel()
        // window.console.log(res)
        // 保存数据
        this.channelList = res.data.data.channels
      } else {
        // 说明没有登录
        // 判断是否存在localstorage
        // 从localstorage 中得到频道数据
        let channels = getLocal('channels')
        window.console.log(channels)
        // 判断频道数据是否存在
        if (channels) {
          // 存在 赋值给channelList
          this.channelList = channels
        } else {
          // 不存在localstorage 频道数据
          // 直接从服务器中获取
          let res = await apiGetChannel()
          // window.console.log(res)
          // 保存数据
          this.channelList = res.data.data.channels
        }
      }
    } catch {
      this.$toast.fail('失败文案')
    }
    // 打印频道数据
    window.console.log(this.channelList)
    // 给频道数据添加额外属性
    this.addOtherProp()
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
.home {
  margin-top: 90px;
  margin-bottom: 50px;
}
.van-tabs__wrap {
  position: fixed;
  top: 46px;
  left: 0;
  z-index: 999;
  width: 90%;
}
.mymenu {
  width: 10%;
  position: fixed;
  top: 46px;
  right: 0;
  z-index: 999;
  height: 44px;
  line-height: 44px;
  text-align: center;
}
.mycell {
  // height: 150px;
  .otherbox {
    display: flex;
    justify-content: space-between;
    .more {
      border: 1px solid #ccc;
      width: 18px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      color: #ccc;
    }
  }
  .other {
    span {
      margin-right: 10px;
      font-size: 12px;
      color: #ccc;
    }
  }
}
</style>
