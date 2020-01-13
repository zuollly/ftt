<template>
  <div class="informationCardWrapper">
      <div class="headImage">
        <img :src="src" alt="">
      </div>
      <div class="listLabel">
        <p v-for="(item, idx) in list" :key="idx" class="plabel" @click="chooseMethods(item)" :class="{plabelActive: item.dictKey===chooseType.dictKey}">
          <svg-icon icon-class="subject" />
          <span class="name">{{item.dictValue}}</span>
        </p>
      </div>
    </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      noticeLoading: false // 是否显示加载中
    }
  },
  computed: {
  },
  props: ['chooseType', 'list', 'jumpType', 'src'],
  watch: {
  },
  methods: {
    chooseMethods(item) {
      if (item.dictKey === this.chooseType.dictKey) {
        return false
      }
      if (this.jumpType === 'notice') { // 公告跳资讯
        this.$router.push({ name: 'informationList' })
      } else if (this.jumpType === 'information') { // 资讯跳公告
        this.$router.push({ name: 'noticeList' })
      } else { // 其他不涉及路由跳转
        this.$emit('updateType', item)
      }
    }
  },
  mounted() {
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.informationCardWrapper{
    .headImage{
      width: 100%;
      height: 100px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .listLabel{
      min-height: 100px;
      padding: 20px 0;
      .plabel{
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        cursor: pointer;
        .name{
          padding-left: 10px;
        }
      }
      .plabelActive{
        background: #F4FCFF;
        color: #52A7FE;
      }
    }
}
</style>
