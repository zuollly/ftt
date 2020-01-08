<template>
  <div class="notice-details-wrapper" v-loading="loading" element-loading-text="拼命加载中">
    <div class="header-wrapper">
      <header class="header">{{details.title}}</header>
      <!-- <el-button type="text" v-if="details.status === 2" @click="withdrawNotice">撤回</el-button> -->
      <el-button class="back" type="text" @click="back">返回</el-button>
    </div>
    <div class="state">
      <p>发布者： {{details.editorName}}</p>
      <p>发布时间： {{details.createTime}}</p>
    </div>
    <div class="content" v-html="details.content"></div>
    <div class="notice-accessory">
      <p v-if="noticeFileList.length > 0" class="p" @click="downloadNotice(item)" v-for="(item, index) in noticeFileList" :key="index">附件 【{{item.fileName}}】</p>
      <p v-if="!noticeFileList || noticeFileList.length <= 0" class="p">暂无附件</p>
    </div>
  </div>
</template>

<script>
import { editNotice, getHomeNoticeDetails } from '@/api/notice.js'
import downloadResource from '@/utils/downloadResource.js'
export default {
  name: 'NoticeShow',
  data() {
    return {
      details: {}, // 详情
      loading: true,
      noticeFileList: [] // 附件列表
    }
  },
  methods: {
    withdrawNotice() {
      const noticeId = this.$route.params.noticeId
      withdrawNoticeOpe(this, noticeId)
    },
    back() {
      const workshopId = this.$route.params.id
      const index = this.$route.query.index
      this.$router.push({
        name: 'noticeList', params: { id: workshopId }, query: { index: index }
      })
    },
    downloadNotice(item) {
      const url = `api/sourceHandle/download?id=${item.id}`
      downloadResource.downloadResource(url)
    }
  },
  mounted() {
    console.log(this.$route.params, '---this.$route.params-------')
    const noticeId = this.$route.params.noticeId
    getNoticeDetails(this, noticeId)
  }
}
function withdrawNoticeOpe(that, id) {
  const workshopId = that.$route.params.id
  const data = {
    id: id,
    status: 3 // 撤回
  }
  that.$confirm('是否确认撤回？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    editNotice(data).then((result) => {
      if (result.data.code === 200) {
        that.$message({ type: 'success', message: `操作成功` })
        that.$router.push({
          name: 'noticeList', params: { id: workshopId }
        })
      }
    })
  }).catch(err => {
    that.$message({ type: 'warning', message: `${err}` })
  })
}
function getNoticeDetails(that, id) {
  const data = {
    id: id
  }
  getHomeNoticeDetails(data).then((result) => {
    if (result.data.code === 200) {
      that.loading = false
      that.details = result.data.result
      that.noticeFileList = result.data.result.fileIds
    }
  }).catch(err => {
    that.loading = false
    that.$message({ type: 'warning', message: `${err}` })
  })
}
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
.notice-details-wrapper{
  background-color: #fff;
  padding: 20px;
  .header-wrapper{
    text-align: center;
    padding: 20px;
    border-bottom: 1px #eee solid;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .header{
      flex: 1;
      line-height: 40px;
      color: #494949;
      font-size: 16px;
    }
    >>> .el-button{
      margin-right: 10px;
      color: #fe3b59;
    }
    .back{
      color: #494949;
    }
  }
  .state{
    width: 100%;
    display: flex;
    height: 45px;
    justify-content: space-between;
    p:nth-child(1){
      text-align: right
    }
    p{
      width: 45%;
      line-height: 45px;
      color: #8c8c8c;
      font-size: 13px;
    }
  }
  .content{
    padding: 20px 40px 20px 40px;
    font-size: 15px;
  }
  .notice-accessory{
    padding: 20px 40px 20px 40px;
    .p{
      padding: 10px;
      cursor: pointer;
      color: #7a7171;
      width: 50%;
    }
  }
}
</style>
