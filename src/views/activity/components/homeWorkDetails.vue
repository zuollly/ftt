<template>
  <div class="homeWorkDetailsWrapper">
    <h4>作业详情：</h4>
    <div class="homeWorkDetailsCon">
      <p>作业标题：{{homeWorkDetails.title}}</p>
      <p v-html="transRichImg(homeWorkDetails.content)"></p>
    </div>
  </div>
</template>

<script>
import { fetchAssignmenthomeworkById } from '@/api/task.js'
import { transRichImg } from '@/utils/filters'
import { mapGetters } from 'vuex'
export default {
  props: ['homeWorkList'],
  data() {
    return {
      homeWorkDetails: {}
    }
  },
  methods: {
    transRichImg,
    queryAssignmenthomeworkById() {
      const data = {
        id: this.homeWorkList[0].serviceId
      }
      fetchAssignmenthomeworkById(data).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.homeWorkDetails = res.data.result
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'uuid'
    ])
  },
  mounted() {
    this.queryAssignmenthomeworkById()
  }
}
</script>
<style lang="scss" scoped>
.homeWorkDetailsWrapper{
  border-top: solid 1px #c8cbce;
  border-bottom: solid 1px #c8cbce;
  margin-bottom: 20px;
  .homeWorkDetailsCon{
    padding:0 20px 0 20px;
  }
}
</style>
