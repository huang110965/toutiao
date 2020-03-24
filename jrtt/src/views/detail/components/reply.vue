<template>
  <div>
    <van-popup class="reply" :value="value" @input="$emit('input', $event)" position="bottom" :style="{ height: '80%' }">
    <!-- 要回复的评论 -->
     <comment :showReplycom="false" :data='currentcomm' />
    <!-- 回复的列表 -->
    <van-cell title="当前评论的回复"></van-cell>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment :showReplycom="false" v-for="(item, index) in replyList" :key="index" :data='item' />
    </van-list>
    <!-- write 组件 -->
    <write @passcommreply="passcommreply" :isreply="true" :commid="currentcomm.com_id" />
    </van-popup>
  </div>
</template>

<script>
// 导入评论的组件
import comment from './comment'
import write from './write'
// 导入bus对象
import bus from '../../../utils/bus'
// 导入 获取评论接口
import { apigetreply } from '../../../api/articles.js'
export default {
  props: ['value'],
  components: {
    comment,
    write
  },
  data () {
    return {
      // 用于接收comment传过来的参数
      currentcomm: [],
      loading: false,
      finished: false,
      // 分页标识,第一页默认不传
      offset: null,
      // 用月存放评论回复列表
      replyList: [],
      endid: 0
    }
  },
  methods: {
    // list 加载事件
    async onLoad () {
      // window.console.log('onLoad')
      // window.console.log(this.currentcomm)
      // 请求评论的回复
      let res = await apigetreply({
        commid: this.currentcomm.com_id.toString(),
        offset: this.offset
      })
      // window.console.log(res)
      // 保存数据
      this.replyList = [...this.replyList, ...res.data.data.results]
      this.offset = res.data.data.last_id
      this.endid = res.data.data.end_id
      // 判断是否加载完毕
      if (this.offset === this.endid) {
        this.finished = true
      }
      // 关闭加载状态
      this.loading = false
    },
    // 接收write组件传过来的参数
    passcommreply (value) {
      // window.console.log(value)
      this.replyList.unshift(value)
      // 添加完回复之后，给评论的数字加1
      this.currentcomm.reply_count += 1
    }
  },
  created () {
    // 接收comment传过来的参数
    bus.$on('passdata', value => {
      // window.console.log(value)
      this.currentcomm = value
      // 清空当前组件中的所有数据
      this.replyList = []
      this.loading = false
      this.finished = false
      this.offset = null
      this.endid = 0
    })
  }
}
</script>

<style lang="less">
.reply {
  margin-bottom: 54px;
}
</style>
