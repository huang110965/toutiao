<template>
  <div class="write">
      <van-search v-model="value" placeholder="请输入评论" show-action @search="onSearch" >
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
// 导入添加评论 & 添加评论回复的方法
import { apiaddcomments, apiaddreply } from '../../../api/articles'
export default {
  // 判断是否是评论回复 评论的id
  props: ['isreply', 'commid'],
  data () {
    return {
      value: ''
    }
  },
  methods: {
    async onSearch () {
      // window.console.log('onSearch')
      // 判断是否是评论的逻辑还是评论回复的逻辑
      if (this.isreply === false) {
        let res = await apiaddcomments({
          artid: this.$route.params.artid,
          content: this.value
        })
        // window.console.log(res)
        let commentslist = res.data.data.new_obj
        this.$emit('addcomment', commentslist)
        // 清空输入框
        this.value = ''
      } else {
        // 处理评论回复的逻辑
        // 将信息提交到服务器
        let res = await apiaddreply({
          commid: this.commid.toString(),
          content: this.value,
          artid: this.$route.params.artid
        })
        // 保存评论回复的数据
        let commreply = res.data.data.new_obj
        // 渲染到reply中
        this.$emit('passcommreply', commreply)
        // 清空输入框
        this.value = ''
      }
    }
  }
}
</script>

<style lang="less">
.write {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .van-search {
        background-color: #3194fa !important;
    }
}

</style>
