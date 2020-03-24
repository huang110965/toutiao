<template>
  <div>
    <!-- 搜索框区域 -->
     <van-search background="#3194fa" v-model="value" placeholder="请输入搜索关键词" show-action @input="think" @search="onSearch" >
       <template slot="action">
         <div class="mycancel" @click="onCancel">取消</div>
       </template>
     </van-search>
     <!-- 联想区域 -->
     <van-cell-group v-if="thinkList.length > 0">
      <van-cell icon="search" v-for="(item, index) in thinkList" :key="index" >
        <template slot="title">
          <div v-html="item.newItem"></div>
        </template>
      </van-cell>
     </van-cell-group>
     <!-- 搜索历史 -->
     <van-cell-group v-else>
      <van-cell title="搜索历史" >
        <template slot="default">
          <van-icon @click="delAll" name="delete"></van-icon>
        </template>
      </van-cell>
      <van-cell icon="search" @click="onSearch(item)"  v-for="(item, index) in historyList" :key="index" :title="item" >
        <template slot="right-icon">
          <van-icon @click="del(item)" name="cross"></van-icon>
        </template>
      </van-cell>
     </van-cell-group>
  </div>
</template>

<script>
// 导入联想接口
import { apiThink } from '../../api/search.js'
// 导入
import { getLocal, setLocal } from '../../utils/mylocal.js'
export default {
  data () {
    return {
      // 搜索框的数据源
      value: '',
      // 是否显示联想
      // isThink: false,
      // 联想结果
      thinkList: [],
      // 定义一个定时器
      timer: null,
      // 搜索历史数据
      historyList: []
    }
  },
  methods: {
    // 事件中有一个参数：这个参数就是搜索框中的值
    onSearch (key) {
      // 判断key不能为空
      if (key.trim().length <= 0) {
        return
      }
      // 保存关键字到页面上
      this.historyList.unshift(key)
      // window.console.log(this.historyList)
      // 去重
      this.historyList = [...new Set(this.historyList)]
      setLocal('history', this.historyList)
      // 跳转到搜索结果页面
      this.$router.push(`/searchResult/${key}`)
    },
    onCancel () {
      // window.console.log('onSearch')
      this.value = ''
      // 清空列表
      this.thinkList = []
    },
    // 联想事件：只要搜索框中的内容发生改变就会触发
    think () {
      // 清除定时器
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 判断内容是否为空
        if (this.value.trim().length <= 0) {
          // 清空列表
          this.thinkList = []
          // 不继续执行
          return
        }
        let res = await apiThink(this.value)
        // window.console.log(res)
        // 将联想的结果保存起来
        this.thinkList = res.data.data.options
        // 遍历使用联想的关键字进行分隔
        this.thinkList = this.thinkList.map(item => {
          return {
            oldItem: item,
            newItem: item.split(this.value).join(`<span style="color:red">${this.value}</span>`)
          }
        })
        window.console.log(this.thinkList)
      }, 500)
    },
    // 删除历史数据
    del (subitem) {
      // 删除前询问用户是否删除
      this.historyList.forEach((item, index) => {
        if (item === subitem) {
          this.historyList.splice(index, 1)
        }
      })
      // 保存到本地
      setLocal('history', this.historyList)
    },
    // 清空历史数据
    delAll () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '你确定要清空搜索历史吗?'
      }).then(() => {
        // 清空
        this.historyList = []
        // 保存到本地
        setLocal('history', this.historyList)
        // 保存到本地
      }).catch(() => {
        // window.console.log('取消')
      })
    }
  },
  created () {
    // 得到搜索的历史数据
    this.historyList = getLocal('history') || []
  }

}
</script>

<style lang='less'>
.mycancel {
  color: #fff;
}
.mycancel:active {
  color: #ccc;
}
.van-search__action:active {
    background-color: #3296fa;
}
</style>
