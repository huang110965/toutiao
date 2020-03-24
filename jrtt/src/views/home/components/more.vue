<template>
  <div>
      <!-- v-more控制显示和隐藏 -->
    <van-dialog v-model="value" :showConfirmButton='false'>
      <van-cell-group v-if="isreports===false">
         <van-cell >
           <template>
             <van-icon name="cross" @click="$emit('input',false)"/>
           </template>
         </van-cell>
         <van-cell icon="fire-o" @click="dislike" title="不感兴趣" />
         <van-cell icon="fire-o" @click="isreports=true" title="反馈垃圾内容" is-link />
         <van-cell icon="fire-o" title="拉黑作者" />
      </van-cell-group>
      <!-- 举报的选项 -->
      <van-cell-group v-if="isreports===true">
        <van-cell>
          <template slot="title">
             <van-icon @click="isreports=false" name="arrow-left" />
          </template>
        </van-cell>
        <van-cell @click="reportsArticle(item.id)" v-for="(item, index) in reportsList" :key="index" :title="item.name" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入 操作对文章不喜欢
import { apiDislike, apiReports } from '../../../api/articles.js'
export default {
  // 控制隐藏
  props: ['value', 'artid'],
  data () {
    return {
      // 判断是否显示举报面板
      isreports: false,
      // 举报的选项
      reportsList: [
        { id: 0, name: '其他问题' },
        { id: 1, name: '标题夸张' },
        { id: 2, name: '低俗色情' },
        { id: 3, name: '错别字多' },
        { id: 4, name: '旧闻重复' },
        { id: 5, name: '广告软文' },
        { id: 6, name: '内容不实' },
        { id: 7, name: '涉嫌违法犯罪' },
        { id: 8, name: '侵权' }
      ]
    }
  },
  methods: {
    // 对文章的不感兴趣
    async dislike () {
      // 关闭面板
      this.$emit('input', false)
      // 从数据源中删除当前 id 对应的文章
      this.$emit('delArticle')
      // 将当前文章 id 提交到服务器,将当前文章标识为不喜欢
      let res = await apiDislike(this.artid)
      window.console.log(res)
    },
    // 举报文章
    async reportsArticle (type) {
      try {
        await apiReports({
          artid: this.artid,
          type: type
        })
        // 添加一个提示框
        this.$toast.success('举报成功')
      } catch {
        this.$toast.fail('已经举报过了')
      }
      // 关闭面板
      this.$emit('input', false)
      // 切换回三个基本操作面板
      this.isreports = false
    }
  }
}
</script>
<style>

</style>
