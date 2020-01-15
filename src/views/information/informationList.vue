<template>
  <div class="notice-details-wrapper" v-loading="noticeLoading" element-loading-text="拼命加载中">
    <el-row class="notice-details-main" :gutter="10">
      <el-col class="home-details" :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
        <div class="informationWrapper bg-white mb-2 border-shadow">
          <chooseCard :src='src' :jumpType='"information"' :chooseType='chooseType' :list='chooseList'></chooseCard>
        </div>
      </el-col>
      <el-col class="home-details" :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">工作室资讯</p>
            <el-button @click="issueContent" type="primary" plain size="mini">发布资讯</el-button>
          </div>
          <WorkshopInformation :page="'hme'" :informationList='homeNoticeList'  @editContent='editContent' @getDeleteContent='getDeleteContent'></WorkshopInformation>
          <div class="pagination" v-if="homeNoticeList.length">
            <el-pagination
              background
               @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 30]"
              :current-page.sync="pageObj.pageCurrent"
              :page-size="pageObj.pageSize"
              :total.sync="pageObj.count">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form
        :model="contentForm"
        ref="noticeFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="contentForm.title" placeholder="请输入资讯标题"></el-input>
        </el-form-item>
        <el-form-item label="资讯内容" prop="content">
          <editor v-if="dialogVisible" name="name" class="editor" v-model="contentForm.content" :height="550"></editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          :disabled="addContentLoading"
          v-loading="addContentLoading"
          type="primary"
          @click="addContent()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { fetchContentPage, insertRelevanceContent, updateRelevanceContent, delRelevanceContent, fetchContentById } from '@/api/content.js'
import { fetchDictInfo } from '@/api/dict.js'
import appConfig from '../../../static/appConfig'
export default {
  name: 'NoticeList',
  components: {
    chooseCard: () => import('@/views/notice/modules/chooseCard.vue'),
    WorkshopInformation: () => import('@/modules/information/workshopInformationList.vue'),
    editor: () => import('@/components/tinymce')
  },
  data() {
    return {
      noticeLoading: true, // 是否显示加载中
      chooseType: { dictKey: '' },
      chooseList: [],
      homeNoticeList: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      },
      contentForm: {
        title: '',
        content: ''
      },
      src: `${appConfig.cfg_fileBasehost}information.jpg`,
      addContentLoading: false,
      dialogVisible: false,
      title: '发资讯',
      opeType: 'add',
      itemCur: null
    }
  },
  computed: {
    ...mapGetters([
      '',
      'isMobile',
      'uuid'
    ])
  },
  watch: {
  },
  methods: {
    addContent() {
      const data = {
        modelCode: 'article',
        title: this.contentForm.title,
        txt: this.contentForm.content,
        userId: this.uuid,
        relevance: {
          contentTypeCode: 'CONTENT_STATIONNEWS_INFO'
        }
      }
      let fn = null
      if (this.opeType === 'add') {
        fn = insertRelevanceContent
      } else {
        fn = updateRelevanceContent
        data.relevance.id = this.itemCur.id
      }
      this.addContentLoading = true
      fn(data).then(res => {
        console.log(res)
        this.addContentLoading = false
        if (res.data.code === 200) {
          this.dialogVisible = false
          this.getNoticeList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    issueContent() {
      this.dialogVisible = true
      this.title = '发资讯'
      this.opeType = 'add'
      this.contentForm = {}
      this.contentForm.content = ''
    },
    editContent(item) {
      console.log(item)
      this.itemCur = item
      this.dialogVisible = true
      this.title = '编辑资讯'
      this.opeType = 'edit'
      this.contentForm.title = item.title
      this.getContentById(item.id)
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getNoticeList()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getNoticeList()
    },
    async getNoticeList() {
      this.noticeLoading = true
      const noticeCodeInfo = await this.getNoticeCode()
      this.chooseList = [...noticeCodeInfo.data.result]
      this.chooseType = noticeCodeInfo.data.result.find(item => {
        return item.dictValue.indexOf('资讯') > -1
      })
      const data = {
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        contentTypeCode: this.chooseType.dictKey,
        moduleId: this.$route.params.id
      }
      fetchContentPage(data).then((result) => {
        console.log(result, 'result')
        if (result.data.code === 200) {
          this.noticeLoading = false
          this.homeNoticeList = result.data.result.list
          this.pageObj.count = result.data.result.total
        }
      }).catch(err => {
        console.log(err)
        this.noticeLoading = !this.noticeLoading
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    getNoticeCode() {
      return new Promise((resolve, reject) => {
        fetchDictInfo({ dictParentKey: 'CONTENT_STATIONNEWS' }).then(res => {
          resolve(res)
        })
      })
    },
    getContentById(id) {
      const data = {
        id: id
      }
      fetchContentById(data).then(res => {
        if (res.data.code === 200) {
          this.contentForm.content = res.data.result.txt ? res.data.result.txt : ''
        }
      })
    },
    getDeleteContent(type, item) {
      const idList = []
      // if (type === 'batch') { // 批量删除
      //   const checkedArr = this.homeNoticeList.filter((item) => {
      //     return item.checked === true
      //   })
      //   if (checkedArr.length === 0) {
      //     this.$message({ message: '请先选择要删除的公告', type: 'warning' })
      //     return false
      //   }
      //   for (const value of checkedArr) {
      //     idList[idList.length] = value.id
      //   }
      // }
      if (type === 'single') { // 单个删除
        idList.push(item.id)
      }
      this.$confirm('是否确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRelevanceContent(idList).then((result) => {
          if (result.data.code === 200) {
            this.$message({ type: 'success', message: '删除成功' })
            this.getNoticeList()
          }
        })
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消' })
        return false
      })
    }
  },
  mounted() {
    this.getNoticeList()
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.notice-details-wrapper{
  .notice-details-main{
    .headWrapper {
      width: 100%;
      height: 50px;
      // padding-bottom: 10px;
      font-size: 14px;
      color: #494949;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: solid #ededed 1px;
      box-sizing: border-box;
      align-items: center;
      // >>> .el-button {
      //   color: #b8b8b8;
      // }
      .p {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        border-bottom: 2px #FF5A00 solid;
        color: #FF5A00;
      }
    }
    .home-details{
      display: flex;
      flex-direction: column;
      .informationWrapper{
        min-height: 300px;
      }
    }
      .bg-white{
        background: #ffffff;
      }
      .border-shadow{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }
      .main-border{
        border: solid #eeeeee 1px;
        padding: 15px 15px 15px 15px;
        box-sizing: border-box;
      }
      .radius-border{
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
      }
      .flex-grow-1{
        flex: 1
      }
  }
}
</style>
