<template>
  <div>
      <van-button icon="star-o" type="primary">按钮</van-button>
  <!-- 圆形图片 -->
  <h4>字体图标</h4>
  <van-icon name="chat-o" color="#1989fa" />
  <h4>vant中的插槽</h4>
  <van-cell title="单元格" value="内容" size="large" label="描述信息">
    <template slot="title">
      单元格
        <van-icon name="gem-o" />
    </template>
  </van-cell>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
