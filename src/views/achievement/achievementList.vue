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
          <div class="headWrapper">
            <p class="p">成果展示</p>
            <el-button @click="issueContent" type="primary" plain size="mini">发布成果展示</el-button>
          </div>
          <WorkShopAchievementList :homeAchievementList='homeAchievementList' @editContent='editContent' @getDeleteContent='getDeleteContent'></WorkShopAchievementList>
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
        <el-form-item label="资讯类型" prop="title">
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
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="contentForm.title" placeholder="请输入资讯标题"></el-input>
        </el-form-item>
        <el-form-item label="资讯内容" prop="content">
          <editor v-if="dialogVisible" name="name" class="editor" v-model="contentForm.content" :height="250"></editor>
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
      src: '../../../static/images/achievement.jpg',
      typeList: [],
      addContentLoading: false,
      dialogVisible: false,
      title: '发成果展示',
      opeType: 'add',
      itemCur: null
    }
  },
  computed: {
    ...mapGetters([
      'workshopUserRoles',
      'isMobile',
      'uuid'
    ])
  },
  watch: {
  },
  methods: {
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
            this.getAchievementList()
          }
        })
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消' })
        return false
      })
    },
    addContent() {
      const data = {
        modelCode: 'article',
        title: this.contentForm.title,
        txt: this.contentForm.content,
        userId: this.uuid,
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
