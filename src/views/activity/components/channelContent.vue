<template>
  <div class="channelWrapper">
    <p v-html="transRichImg(channelInfo.title)"></p>
    <p v-html="transRichImg(channelInfo.introduction)"></p>
  </div>
</template>

<script>
import { contentInfo } from '@/api/activityCopy.js'
import { transRichImg } from '@/utils/filters'
export default {
  props: ['channelList'],
  data() {
    return {
      channelInfo: {}
    }
  },
  watch: {
    channelList: function(val) {
      if (val.length) {
        this.queryChannelInfo()
      }
    }
  },
  methods: {
    transRichImg,
    queryChannelInfo() {
      if (this.channelList[0].serviceId) {
        this.contentInfo({ id: this.channelList[0].serviceId }).then(res => {
          if (res.data.code === 200) {
            this.channelInfo = res.data.result
          }
        })
      }
    },
    contentInfo(params) { // 获取栏目基本信息
      return new Promise((resolve, reject) => {
        contentInfo(params).then(res => {
          resolve(res)
        })
      })
    }
  },
  mounted() {
    this.queryChannelInfo()
  }
}
</script>

<style lang="scss" scoped>
.channelWrapper{
  margin-bottom: 20px
}
</style>

