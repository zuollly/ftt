<template>
  <div class="achievement-details-wrapper" v-loading="achievementLoading" element-loading-text="拼命加载中">
    <el-row class="achievement-details-main" :gutter="10">
      <el-col class="home-details" :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
        <div class="informationWrapper bg-white mb-2 border-shadow">
          <chooseCard :src='src' :chooseType='chooseType' @updateType='updateType' :list='chooseList'></chooseCard>
        </div>
      </el-col>
      <el-col class="home-details" :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <!-- <div class="headWrapper">
            <p class="p">成果展示</p>
            <el-button @click="issueContent" type="primary" plain size="mini">发布成果</el-button>
          </div> -->
          <div class="headWrapper">
            <el-radio-group v-model="searchType">
              <el-radio-button label="1">所有成果</el-radio-button>
              <el-radio-button label="mine">我发布的成果</el-radio-button>
              <el-radio-button label="0">待审核成果</el-radio-button>
            </el-radio-group>
            <div>
              <el-button v-if="workshopPermissionInfo.CONTENT_ACHIEVEMENT_VERIFY&&searchType==='0'" @click="passContent" type="success" plain size="mini">通过</el-button>
              <el-button v-if="workshopPermissionInfo.CONTENT_ACHIEVEMENT_VERIFY&&searchType==='0'" @click="refuseContent" type="warning" plain size="mini">不通过</el-button>
              <el-button v-if="workshopPermissionInfo.CONTENT_ACHIEVEMENT_DELETE&&searchType!=='0'" @click="getDeleteContent('batch')" type="danger" plain size="mini">删除</el-button>
              <el-button v-if="workshopPermissionInfo.CONTENT_ACHIEVEMENT_INSERT" @click="issueContent" type="primary" plain size="mini">发布成果</el-button>
            </div>
          </div>
          <WorkShopAchievementList :clearAll='clearAll' @getRefresh='getRefresh' @getSelectedData='getSelectedData' :homeAchievementList='homeAchievementList' @editContent='editContent' @getDeleteContent='getDeleteContent'></WorkShopAchievementList>
          <div class="pagination" v-if="homeAchievementList.length">
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
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="50%"
    >
      <el-form
        :model="contentForm"
        ref="noticeFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="成果类型" prop="title">
          <!-- <el-input v-model="contentForm.title" placeholder="请输入资讯标题"></el-input> -->
          <el-select v-if="opeType==='add'" v-model="contentForm.type">
            <el-option
              v-for="(item, idx) in typeList"
              :key="idx"
              :label="item.dictValue"
              :value="item.dictKey"></el-option>
          </el-select>
          <el-select v-else disabled v-model="contentForm.type">
            <el-option
              v-for="(item, idx) in typeList"
              :key="idx"
              :label="item.dictValue"
              :value="item.dictKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成果标题" prop="title">
          <el-input v-model="contentForm.title" placeholder="请输入资讯标题"></el-input>
        </el-form-item>
        <el-form-item label="成果内容" prop="content">
          <editor v-if="dialogVisible" name="name" class="editor" v-model="contentForm.content" :height="250"></editor>
        </el-form-item>
        <el-form-item label="上传成果" required>
            <el-upload
              ref="upload"
              class="upload-demo"
              name="multipartFile"
              :action="uploadUrl()"
              :headers="headers"
              accept=".xls,.xlsx,.doc,.docx,.ppt,.pptx,.pps,.ppsx,.txt,.pdf,.mp4"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :file-list="fileList"
              >
              <el-button size="small" type="primary">上传文件</el-button>
            </el-upload>
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
import { fetchContentPage, insertRelevanceContent, updateRelevanceContent, delRelevanceContent, fetchContentById, verifyContentPage } from '@/api/content.js'
import { fetchDictInfo } from '@/api/dict.js'
import { getToken } from '@/utils/storage/cookies'
import appConfig from '../../../static/appConfig'

export default {
  name: 'Achievement',
  components: {
    chooseCard: () => import('@/views/notice/modules/chooseCard.vue'),
    WorkShopAchievementList: () => import('@/modules/achievement/workShopAchievementList.vue'),
    editor: () => import('@/components/tinymce')
  },
  data() {
    return {
      achievementLoading: false, // 是否显示加载中
      chooseType: { dictKey: '' },
      chooseList: [],
      homeAchievementList: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      },
      contentForm: {
        type: '',
        title: '',
        content: ''
      },
      src: `${appConfig.cfg_fileBasehost}achievement.jpg`,
      typeList: [],
      addContentLoading: false,
      dialogVisible: false,
      title: '发成果展示',
      opeType: 'add',
      itemCur: null,
      searchType: '1',
      checkedList: [],
      clearAll: false,
      modelCode: '',
      fileList: [],
      headers: {
        'enctype': 'multipart/form-data',
        'Authorization': 'Bearer ' + getToken()
      }
    }
  },
  computed: {
    ...mapGetters([
      'workshopPermissionInfo',
      'isMobile',
      'uuid'
    ])
  },
  watch: {
    searchType: function() {
      this.clearAll = true
      this.getAchievementList()
    }
  },
  methods: {
    uploadUrl() {
      console.log(appConfig, 'appConfig')
      return appConfig.cfg_upfile_path
    },
    beforeAvatarUpload(file) { // 上传文件之前的钩子，参数为上传的文件
      // eslint-disable-next-line no-array-constructor
      var fileName = new Array()
      fileName = file.name.split('.')
      console.log(fileName[fileName.length - 1])
      const extension = fileName[fileName.length - 1] === 'xls'
      const extension2 = fileName[fileName.length - 1] === 'xlsx'
      const extension3 = fileName[fileName.length - 1] === 'doc'
      const extension4 = fileName[fileName.length - 1] === 'docx'
      const extension5 = fileName[fileName.length - 1] === 'ppt'
      const extension6 = fileName[fileName.length - 1] === 'pptx'
      const extension7 = fileName[fileName.length - 1] === 'pps'
      const extension8 = fileName[fileName.length - 1] === 'ppsx'
      const extension9 = fileName[fileName.length - 1] === 'txt'
      const extension10 = fileName[fileName.length - 1] === 'pdf'
      const extension11 = fileName[fileName.length - 1] === 'mp4'
      const isLt2M = file.size / 1024 / 1024 < 500
      if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9 && !extension10 && !extension11) {
        this.$message({
          message: '上传模板只能是xls,xlsx,doc,docx,ppt,pptx,pps,ppsx,txt,pdf,mp4格式!',
          type: 'warning'
        })
        this.fileOk = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传模板大小不能超过 500MB!',
          type: 'warning'
        })
        this.fileOk = false
        return false
      }
      this.fileOk = true
    },
    beforeRemove(file, fileList) { // 删除文件之前的钩子，参数为上传的文件和文件列表
      if (this.fileOk === true) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    handleRemove(file, fileList) {
      // const fileId = (file.response && file.response.result && file.response.result.id) || file.id
      // // 防止服务器空间非法占用
      // fileService.deleteFile({ id: fileId })
      // this.fileList.forEach((att, attIndex) => {
      //   if (att.fileId === fileId) this.fileList.splice(attIndex, 1)
      // })
      // this.file = {}
    },
    uploadSuccess(res) {
      this.file = res.result
      console.log(res)
      switch (this.file.fileCategory) {
        case 'document':
          this.modelCode = 'doc'
          break
        case 'picture':
          this.modelCode = 'doc'
          break
        case 'voice':
        case 'video':
          this.modelCode = 'video'
          break
        default:
          this.modelCode = 'doc'
          break
      }
    },
    getDeleteContent(type, item) {
      const idList = []
      if (type === 'batch') { // 批量删除
        if (this.checkedList.length === 0) {
          this.$message({ message: '请先选择要删除的内容', type: 'warning' })
          return false
        }
        for (const value of this.checkedList) {
          idList[idList.length] = value.id
        }
      }
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
            this.checkedList = []
            this.getAchievementList()
            this.clearAll = true
          }
        })
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消' })
        return false
      })
    },
    addContent() {
      if (!(this.file && this.file.id)) {
        this.$message({ message: '请上传文件', type: 'error', duration: 2000 })
        return false
      }
      const data = {
        modelCode: this.modelCode,
        title: this.contentForm.title,
        txt: this.contentForm.content,
        userId: this.uuid,
        doc: {
          fileId: this.file.id,
          fileName: this.file.fileName,
          fileType: this.file.fileType,
          fileSize: this.file.fileSize
        },
        relevance: {
          contentTypeCode: this.contentForm.type,
          moduleId: this.$route.params.id
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
          this.getAchievementList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    issueContent() {
      this.dialogVisible = true
      this.title = '发成果展示'
      this.opeType = 'add'
      this.contentForm = {}
      this.contentForm.content = ''
    },
    editContent(item) {
      console.log(item)
      this.itemCur = item
      this.dialogVisible = true
      this.title = '编辑成果展示'
      this.opeType = 'edit'
      this.contentForm.title = item.title
      this.contentForm.type = item.contentTypeCode
      this.getContentById(item.id)
    },
    refuseContent() {
      const idList = []
      if (this.checkedList.length === 0) {
        this.$message({ message: '请先选择不通过的内容', type: 'warning' })
        return false
      }
      for (const value of this.checkedList) {
        idList[idList.length] = value.id
      }
      this.$confirm('是否确认拒绝？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        verifyContentPage(idList, 2, this.uuid).then((result) => {
          if (result.data.code === 200) {
            this.$message({ type: 'success', message: '操作成功' })
            this.checkedList = []
            this.getAchievementList()
            this.clearAll = true
          }
        })
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消' })
        return false
      })
    },
    passContent() {
      const idList = []
      if (this.checkedList.length === 0) {
        this.$message({ message: '请先选择要通过的内容', type: 'warning' })
        return false
      }
      for (const value of this.checkedList) {
        idList[idList.length] = value.id
      }
      this.$confirm('是否确认通过？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        verifyContentPage(idList, 1, this.uuid).then((result) => {
          if (result.data.code === 200) {
            this.$message({ type: 'success', message: '操作成功' })
            this.checkedList = []
            this.getAchievementList()
            this.clearAll = true
          }
        })
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消' })
        return false
      })
    },
    getRefresh() {
      this.getAchievementList()
    },
    getSelectedData(list) {
      this.clearAll = false
      this.checkedList = list
    },
    getContentById(id) {
      const data = {
        id: id
      }
      fetchContentById(data).then(res => {
        if (res.data.code === 200) {
          this.contentForm.content = res.data.result.txt ? res.data.result.txt : ''
          const resourceForm = res.data.result
          if (resourceForm.fileId) {
            this.fileList = [
              {
                id: resourceForm.fileId,
                fileName: resourceForm.fileName,
                fileSize: resourceForm.fileSize,
                fileType: resourceForm.fileType,
                name: resourceForm.fileName
              }
            ]
          } else {
            this.fileList = []
          }
        }
      })
    },
    updateType(item) {
      this.chooseType = Object.assign({}, item)
      this.getAchievementList()
    },
    getAchievementCode() {
      return new Promise((resolve, reject) => {
        fetchDictInfo({ dictParentKey: 'CONTENT_ACHIEVEMENT' }).then(res => {
          console.log(res)
          resolve(res)
        })
      })
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getAchievementList()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getAchievementList()
    },
    getAchievementList() {
      this.achievementLoading = true
      const data = {
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        moduleId: this.$route.params.id
      }
      if (this.searchType === 'mine') {
        data.userId = this.uuid
      } else {
        data.verifyStatus = this.searchType
      }
      if (this.chooseType.dictKey) {
        data.contentTypeCode = this.chooseType.dictKey
      } else {
        data.contentTypeCode = 'CONTENT_ACHIEVEMENT'
      }
      fetchContentPage(data).then((result) => {
        if (result.data.code === 200) {
          this.achievementLoading = false
          this.homeAchievementList = result.data.result.list
          this.pageObj.count = result.data.result.total
        }
      }).catch(err => {
        console.log(err)
        this.achievementLoading = !this.achievementLoading
        this.$message({ type: 'warning', message: `${err}` })
      })
    }
  },
  mounted() {
    this.getAchievementList()
    this.getAchievementCode().then(res => {
      console.log(res.data.result)
      const list = [{ dictValue: '全部', dictKey: '' }]
      this.chooseList = [...list, ...res.data.result]
      this.typeList = [...res.data.result]
    })
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.achievement-details-wrapper{
  .achievement-details-main{
    .headWrapper {
      width: 100%;
      height: 50px;
      // padding-bottom: 10px;
      font-size: 14px;
      // color: #494949;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: solid #ededed 1px;
      box-sizing: border-box;
      align-items: center;
      >>> .el-button {
        // color: #b8b8b8;
      }
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
