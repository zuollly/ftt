<template>
  <div class="home-notice-add" v-loading="loading" element-loading-text="拼命加载中">
    <div class="home-notice-header">
      <Header :title='title' @goBack='goBack'></Header>
    </div>
    <div class="home-notice-content">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="公告标题" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="正文" required>
          <tinymce :value='form.value' v-model="form.value"></tinymce>
        </el-form-item>
        <el-form-item label="添加附件">
          <UploadFile :fileList='fileList' @getFileList='getNoticeFileList'></UploadFile>
        </el-form-item>
        <el-form-item>
          <el-button @click="addNotice('add')" type="primary">发布</el-button>
          <el-button @click="addNotice('draft')" type="info">保存为草稿</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addHomeNotice, getHomeNoticeDetails, editNotice } from '@/api/notice.js'
import { mapGetters } from 'vuex'
export default {
  name: 'NoticeAdd',
  components: {
    tinymce: () => import('@/components/tinymce/index.vue'),
    Header: () => import('@/modules/Header.vue'),
    UploadFile: () => import('@/modules/UploadFile.vue')
  },
  data() {
    return {
      form: { // 新增内容
        name: '',
        value: ''
      },
      title: '', // 编辑 && 发布
      loading: true,
      fileList: [], // 用于展示在长传按钮下方的文件列表
      fileListParams: [] // 上传文件列表参数
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  methods: {
    onSubmit() {},
    goBack() {
      if (this.$route.query.noticeType === 'edit') {
        const workshopId = this.$route.params.id
        const index = this.$route.query.index
        this.$router.push({
          name: 'noticeList', params: { id: workshopId }, query: { index: index }
        })
      } else {
        this.$router.back(-1)
      }
    },
    cancel() {
      this.goBack()
    },
    // 公告发布 保存为草稿或者直接发布 draft=保存为草稿  add=发布
    addNotice(type) {
      const workshopId = this.$route.params.id
      const index = this.$route.query.index
      if (!this.form.name) {
        this.$message({ type: 'warning', message: `请填写公告标题` })
        return
      }
      if (this.form.name.length > this.appConfig.cfg_titleLength) {
        this.$message({ type: 'warning', message: `标题长度不应超过50` })
        return
      }
      if (!this.form.value) {
        this.$message({ type: 'warning', message: `请填写公告内容` })
        return
      }
      if (this.form.name.length > this.appConfig.cfg_disc) {
        this.$message({ type: 'warning', message: `公告内容长度过长` })
        return
      }
      const data = {
        category: 2,
        content: this.form.value,
        title: this.form.name,
        pageAsc: false,
        fileIds: this.fileListParams
      }
      // 公告保存状态  是草稿 还是 直接发布
      if (type === 'draft') {
        data.status = 1
      }
      if (type === 'add') {
        data.status = 2
      }
      // 添加还是编辑
      let fn = null
      if (this.$route.query.noticeType === 'edit') {
        const noticeId = this.$route.query.noticeId
        data.id = noticeId
        fn = editNotice
      } else if (this.$route.query.noticeType === 'add') {
        data.categoryId = workshopId
        fn = addHomeNotice
      }
      fn(data).then((result) => {
        if (result.data.code === 200) {
          this.$message({ type: 'success', message: `操作成功` })
          if (this.$route.query) {
            this.$router.push({
              name: 'noticeList', params: { id: workshopId }, query: { index: index }
            })
          } else {
            this.$router.push({
              name: 'noticeList', params: { id: workshopId }
            })
          }
        }
      }).catch(err => {
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    getNoticeFileList(fileList) {
      const list = []
      if (fileList && fileList.length) {
        fileList.forEach(element => {
          if (element.response && element.response.result) {
            list.push(element.response.result)
          } else {
            list.push({ fileName: element.name, fileKey: element.fileKey, fileSize: element.fileSize, id: element.id, createUserId: element.createUserId })
          }
        })
        list.forEach((item) => {
          delete item.deleted
          delete item.createTime
        })
        this.fileListParams = list
      } else {
        this.fileListParams = []
      }
    }
  },
  mounted() {
    if (this.$route.query.noticeType === 'add') {
      this.loading = false
      this.title = '公告发布'
      this.form.name = ''
      this.form.value = ''
    } else {
      this.title = '公告编辑'
      const noticeId = this.$route.query.noticeId
      getNoticeDetails(this, noticeId)
    }
  }
}
function getNoticeDetails(that, id) {
  const data = {
    id: id
  }
  getHomeNoticeDetails(data).then((result) => {
    if (result.data.code === 200) {
      that.loading = false
      that.form.name = result.data.result.title
      that.form.value = result.data.result.content
      const tempList = []
      if (result.data.result.fileIds && result.data.result.fileIds.length) {
        result.data.result.fileIds.forEach((item) => {
          tempList.push({ name: item.fileName, fileKey: item.fileKey, fileSize: item.fileSize, id: item.id, createUserId: item.createUserId })
        })
      }
      that.fileList = tempList
      that.getNoticeFileList(that.fileList)
    }
  }).catch(err => {
    that.loading = false
    that.$message({ type: 'warning', message: `${err}` })
  })
}
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
.home-notice-add{
  // height: 100px;
  padding: 20px;
  background-color: #fff;
  .home-notice-header{
    height: 30px;
    border-bottom: 1px #eee solid;
    font-size: 15px;
  }
  .home-notice-content{
    padding: 20px 10% 20px 10%;
    >>> .el-input{
      width: 30%;
    }
  }
}
.screen-xs{
  .home-notice-add{
    padding: 5px;
    .home-notice-content{
      padding: 20px 5px 20px 0;
    }
  }
}
.screen-sm{
  .home-notice-add{
    padding: 5px;
    .home-notice-content{
      padding: 20px 5px 20px 0;
    }
  }
}
.screen-md{
  .home-notice-add{
    padding: 5px;
    .home-notice-content{
      padding: 20px 5px 20px 0;
    }
  }
}
</style>
