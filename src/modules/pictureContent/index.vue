<template>
  <div class="pictureContentWrapper">
    <div class="block">
      <div class="content" v-for="(item, idx) in achievementDataList" :key="idx">
        <img src="../../../static/images/swiper.jpg" alt="">
        <p class="title">成果展示</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['achievementDataList']
}
</script>
<style lang="scss" scoped>
.pictureContentWrapper{
  .block{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .content{
      width: 18%;
      margin-right: 2%;
      margin-bottom: 20px;
      height: 150px;
      // filter: brightness(0.5);
      cursor: pointer;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
      .title{
        position: absolute;
        left: 0;
        bottom: 0;
        height: 30px;
        width: 100%;
        line-height: 30px;
        text-align: center;
        background: rgba($color: #000000, $alpha: 0.5);
        color: white;
      }
    }
  }
}
</style>
