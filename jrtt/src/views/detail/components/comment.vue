<template>
  <van-cell>
      <template slot="title">
         <div class="commentBox">
             <div class="comImg">
                 <img :src="data.aut_photo" alt="">
             </div>
             <div class="comMsg">
                 <div class="comaut">{{data.aut_name}}</div>
                 <div class="comcontent">{{data.content}}</div>
                 <div class="comOther">
                     <span class="myspan">{{data.pubdate | timefilter}}</span>
                     <van-button v-if="showReplycom" @click="showReply" round size="mini" type="default">回复{{data.reply_count}}</van-button>
                 </div>
             </div>
             <div class="comlove">
                 <van-icon name="like"></van-icon>{{data.like_count}}
             </div>
         </div>
      </template>
  </van-cell>
</template>

<script>
// 导入bus对象
import bus from '../../../utils/bus'
export default {
  // showReply控制回复按钮的显示和隐藏
  props: ['data', 'showReplycom'],
  data () {
    return {}
  },
  methods: {
    showReply () {
      // 修改父组件的replyshow 改为true
      this.$emit('showReply', true)
      // 将当前参数传入兄弟组件reply中
      bus.$emit('passdata', this.data)
    }
  }
}
</script>

<style lang="less">
.commentBox {
    display: flex;
    .comImg {
        img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
        }
    }
    .comMsg {
        flex: 1;
        margin-left: 15px;
        .comaut {
            color: #a4b3c0;
        }
        .comcontent {
            margin-left: 10px;
        }
        .comOther {
            .myspan {
                margin-right: 20px;
            }
        }
    }
}

</style>
