<template>
<!-- 封装 频道操作面板的结构 & 样式 & 逻辑 -->
  <div>
    <van-popup :value="value" @input="$emit('input',$event)" position="bottom" :style="{ height: '90%' }">
      <!-- 添加结构样式 -->
      <!-- 关闭按钮 -->
      <van-cell>
        <template slot="title">
          <van-icon @click="close" class="cross" name="cross" />
        </template>
      </van-cell>
      <!-- 我的频道区域 -->
      <van-cell>
        <template slot="title">
          <div>我的频道</div>
        </template>
        <template slot="default">
          <van-button v-if="showicon===false" @click="showicon=true" plain round hairline type="danger" size="mini">编辑</van-button>
           <van-button v-else @click="showicon=false" plain round hairline type="danger" size="mini">完成</van-button>
        </template>
      </van-cell>
      <!-- 我的频道选项 -->
      <van-grid :gutter="10">
        <van-grid-item  @click="changeActive(index)" class="itemfather" v-for="(item, index) in channelList" :key="index">
            <template slot="text">
                <span :class="{active: active === index}" class="word">{{ item.name }}</span>
                <van-icon @click.stop="removeChannel(item)" v-if="showicon && index !== 0" class="itemson" name="clear" />
            </template>
        </van-grid-item>

      </van-grid>
      <!-- 频道推荐区域 -->
      <van-cell>
        <template slot="title">
          <div>频道推荐</div>
        </template>
      </van-cell>
      <!-- 频道推荐选项 -->
      <van-grid :gutter="10">
        <van-grid-item @click="addChannel(item)" v-for="(item, index) in otherChannel" :key="index" :text="item.name" />
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
// 导入操作频道的方法
import { apiGetAllChannel, apiResetChannel } from '../../../api/channels.js'
// 导入localstorage
import { setLocal } from '../../../utils/mylocal.js'
export default {
  // value:控制面板的显示和隐藏 ,channelList :从Home中传入的
  props: ['value', 'channelList', 'active'],
  data () {
    return {
      // 控制叉叉的显示和隐藏
      showicon: false,
      // 用于存放所有的频道列表
      allChannel: []
    }
  },
  methods: {
    // 关闭面板
    close () {
      this.$emit('input', false)
    },
    // 得到所有的频道数据
    async getAllChannel () {
      // 发送请求
      let res = await apiGetAllChannel()
      // window.console.log(res)
      this.allChannel = res.data.data.channels
      // window.console.log(this.allChannel)
      // window.console.log(this.channelList)
    },
    // 添加频道
    async addChannel (item) {
      window.console.log(item)
      // 动态添加其他的额外属性
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'isloading', false)
      this.$set(item, 'list', [])
      // 将当前频道 添加到我的频道列表中
      this.channelList.push(item)
      // 数据添加之后，应该将数据的状态进行保存：
      // 判断用户是否登录
      let user = this.$store.state.user
      if (user.token) {
        // 如果登录将新的频道数据保存到服务器中
        let channels = []
        // 去电第一条数据:推荐数据
        // slice 可以从数据中去掉一条数据
        this.channelList.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        // window.console.log(channels)
        // 将我的频道数据提交到服务器中
        await apiResetChannel(channels)
      } else { // 未登录
        // 将频道数据保存到 Localstorage 中
        setLocal('channels', this.channelList)
      }
    },
    // 删除频道
    async removeChannel (obj) {
      // 将当前频道数据从我的频道中删除
      this.channelList.forEach((item, index) => {
        // 判断
        if (item.id === obj.id) {
          this.channelList.splice(index, 1)
        }
      })
      // 判断是否登录
      let user = this.$store.state.user
      if (user.token) { // 已登录生成频道数组
        // 如果登录将新的频道数据保存到服务器中
        let channels = []
        // 去电第一条数据:推荐数据
        // slice 可以从数据中去掉一条数据
        this.channelList.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        // window.console.log(channels)
        // 将我的频道数据提交到服务器中
        await apiResetChannel(channels)
      } else {
        // 将频道数据保存到 Localstorage 中
        setLocal('channels', this.channelList)
      }
    },
    // 切换高亮的选项
    changeActive (index) {
      // 通过自定义事件将得到的下标传入到 home 组件中
      this.$emit('update:active', index)
    }
  },
  created () {
    this.getAllChannel()
  },
  computed: {
    // 从所有频道数据中取出我的频道数据中不存在的元素
    otherChannel () {
      // 1.0 得到我的频道数组中所有元素的 id 集合
      let ids = []
      this.channelList.forEach(item => {
        ids.push(item.id)
      })
      // 2.0 遍历全部的频道数据，判断数组中元素的 id 是否在上面的集合中
      let other = []
      this.allChannel.forEach(item => {
        if (!ids.includes(item.id)) {
          other.push(item)
        }
      })
      // 将新的数组返回
      return other // [{ id:0, name: '' }]
    }
  }
}
</script>

<style lang="less">
  .cross {
      font-size: 30px;
  }
  .itemfather {
      position: relative;
      .itemson {
      position: absolute;
      top: 0;
      right: 0;
      color: #4b4c4c;
   }
   .word {
       color: #646566;
    font-size: 12px;
   }
   .active {
     color: red;
   }
  }
</style>
