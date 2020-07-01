<template>
  <div class="activityContent">
    <div class="a-descripe" style="position: relative;">
      <span class="font-Size16 a-title" style="border-bottom: 3px solid #00cbac;">{{currentStep.stepName}}</span>
    </div>
    <div v-html="currentStepInfo.description" class="description"></div>
    <div class="N-content">
      <step-resource v-if="resourcesList.length" :resourcesList='resourcesList' :holderInfo="holderInfo"></step-resource>
      <div v-if="vedioList.length" class="mb-3">
        <el-button type="success" @click="getIntoVedio" size="small">进入直播</el-button>
        <div>
          <span style="cursor: pointer" class="mr-5" @click="getAttendMember">教研参与人数：<a>{{videoStatus.attendCount}}</a></span>
          <span>教研直播观看人次：{{videoStatus.liveCount}}</span>
        </div>
        <el-table :data="vedioPlayList" style="width: 100%">
          <el-table-column prop="pxFile.fileSize" label="文件大小"></el-table-column>
          <el-table-column prop="pxFile.fileType" label="文件类型"></el-table-column>
          <el-table-column prop="attendTime" label="开始时间">
            <template slot-scope="scope">{{scope.row.startTime | parseTime('{y}-{m}-{d}')}}</template>
          </el-table-column>
          <el-table-column prop="attendTime" label="结束时间">
            <template slot-scope="scope">{{scope.row.stopTime | parseTime('{y}-{m}-{d}')}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <a @click="enterMeeting(scope.row)">{{scope.row.pxFile.fileUrl}}</a> -->
              <el-button type="primary" size="mini" @click="enterMeeting(scope.row)">回放</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination @current-change="handleLinkCurrentChange" :current-page.sync="linkPageObj.pageCurrent" :page-size="linkPageObj.pageSize" layout="prev, pager, next" :total="linkPageObj.total">
          </el-pagination>
        </div>
      </div>
      <comment @commenthandle='commenthandle' v-if="commentList.length" :userId='uuid' :categoryId='commentList[0].stepId' :category='category' :categoryUrl='categoryUrl' :categoryName.sync='channelInfo.title' :loginRouteName='loginRouteName' objType='activity'></comment>
    </div>
    <el-dialog title="参与人数详情" :visible.sync="memberDialogVisible" width="40%">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input clearable size="small" placeholder="请输入参与人员姓名" v-model="formQuery.username"></el-input>
        </el-col>
        <el-col :span="6">
          <el-select clearable size="small" placeholder="请选择角色" v-model="formQuery.attend">
            <el-option value="" label="全部"></el-option>
            <el-option value="chair" label="主持人"></el-option>
            <el-option value="guest" label="参与人员"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="searchMember">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="memberList" style="width: 100%">
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column label="身份">
          <template slot-scope="scope">
            <span>{{scope.row.role || roleTurn}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="attendTime" label="参与时间"></el-table-column>
        <el-table-column prop="ip" label="ip地址"></el-table-column>
      </el-table>
      <div>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageObj.pageCurrent" :page-size="pageObj.pageSize" layout="prev, pager, next" :total="pageObj.total">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="memberDialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
    <el-dialog title="回放" :visible.sync="playDialogVisible" width="45%">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="playDialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { oneActivityStepRequirement, fetchCourseInfo, fetchOneHomeWork, StepServerList, contentInfo, oneActivityStep, stepComplete } from '@/api/activityCopy.js'
import { fetchCommentPage } from '@/api/comment'
import { intoConference, fetchConferenceStatistics, fetchAttendMemberList, fetchConferenceFile } from '@/api/tool.js'
import { mapGetters } from 'vuex'
export default {
  props: ['currentStep', 'holderInfo'],
  components: {
    stepResource: () => import('./stepResource.vue'),
    comment: () => import('@/components/comment/index.vue')
  },
  data() {
    return {
      currentStepRequirement: [],
      courseList: [],
      homeWorkList: [],
      channelList: [],
      commentList: [],
      categoryId: '',
      category: 'doc',
      categoryUrl: '',
      categoryName: '',
      loginRouteName: 'login',
      currentStepInfo: {},
      // stepServerType: '',
      myCommentList: [],
      channelInfo: {
        title: ''
      },
      resourcesList: [],
      vedioList: [],
      videoStatus: {
        attendCount: 0,
        liveCount: 0
      },
      memberDialogVisible: false,
      playDialogVisible: false,
      memberList: [],
      vedioPlayList: [],
      linkPageObj: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0
      },
      pageObj: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0
      },
      formQuery: {
        username: '',
        attend: ''
      },
      meetingUrl: ''
    }
  },
  filters: {
    roleTurn(val) {
      let str = ''
      switch (val) {
        case 'chair':
          str = '主持人'
          break
        case 'guest':
          str = '参与人'
          break
        default:
          str = '未知'
          break
      }
      return str
    }
  },
  computed: {
    ...mapGetters([
      'uuid'
    ])
  },
  watch: {
    currentStep(val) {
      this.getOneActivityStepInfo({ stepId: this.currentStep.id })
      this.getOneActivityStepRequirement({ id: val.id })
      this.getOneActivityStepServerList({ id: val.id })
    }
  },
  mounted() {
    this.getOneActivityStepInfo({ stepId: this.currentStep.id })
    this.getOneActivityStepRequirement({ id: this.currentStep.id })
    this.getOneActivityStepServerList({ id: this.currentStep.id })
  },
  methods: {
    getOneActivityStepInfo(params) { // 当前环节的详情
      return this.oneActivityStep(params).then(res => { // 利用es7的async此处必须写return
        if (res.data.code === 200) {
          this.currentStepInfo = res.data.result
        }
      })
    },
    getRequireMent(desc, val) {
      let str = ''
      const A = desc.split('%%')[0]
      const B = desc.split('%%')[1]
      str = A + val + B + ';'
      return str
    },
    getOneActivityStepRequirement(params) { // 获取当前环节的要求
      this.oneActivityStepRequirement(params).then(res => {
        if (res.data.code === 200) {
          this.currentStepRequirement = res.data.result
        }
      })
    },
    queryChannelInfo() {
      if (this.channelList[0].serviceId) {
        this.contentInfo({ id: this.channelList[0].serviceId }).then(res => {
          console.log(res.data, 98)
          if (res.data.code === 200) {
            this.channelInfo = res.data.result
          }
        })
      }
    },
    commenthandle(value) {
      if (value.comment === 'comment' && value.status) {
        this.checkCommentFinlish()
      }
    },
    checkCommentFinlish() { // 检查评论完成了没有
      this.fetchCommentPage({
        // category: '',
        categoryId: this.currentStep.id,
        pageCurrent: 1,
        pageSize: 1000
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.myCommentList = res.data.result.list
          if (res.data.result.list.length > this.currentStepRequirement[0].stepRequirementData) { // 评论的条数达到要求了
            this.stepComplete({ activityId: this.$route.params.activityId, stepId: this.currentStepInfo.id, userId: this.uuid })
          }
        }
      })
    },
    getOneActivityStepServerList(params) { // 获取当前活动的服务
      this.courseList = []
      this.homeWorkList = []
      this.channelList = []
      this.commentList = []
      this.resourcesList = []
      this.vedioList = []
      return this.StepServerList(params).then(res => {
        if (res.data.code === 200 && res.data.result.length) {
          const courseList = []
          const homeWorkList = []
          const channelList = []
          const commentList = []
          const resourcesList = []
          const vedioList = []
          res.data.result.forEach(element => {
            if (element.serviceTypeCode === 'course') {
              courseList.push(element)
            }
            if (element.serviceTypeCode === 'homeWork') {
              homeWorkList.push(element)
            }
            if (element.serviceTypeCode === 'channel') {
              channelList.push(element)
            }
            if (element.serviceTypeCode === 'comment') {
              // this.stepServerType = 'comment'
              commentList.push(element)
              this.checkCommentFinlish()
            }
            if (element.serviceTypeCode === 'resourceShow') {
              resourcesList.push(element)
            }
            if (element.serviceTypeCode === 'resourceShare') {
              resourcesList.push(element)
            }
            if (element.serviceTypeCode === 'video_interaction') {
              vedioList.push(element)
            }
          })
          this.courseList = [...courseList]
          this.homeWorkList = [...homeWorkList]
          this.channelList = [...channelList]
          this.commentList = [...commentList]
          this.resourcesList = resourcesList
          this.vedioList = [...vedioList]
          if (channelList.length) {
            this.queryChannelInfo()
          }
          if (vedioList.length) {
            this.queryConferenceStatistics()
            this.queryConferenceFile()
          }
        }
      })
    },
    getIntoVedio() {
      const params = {
        serviceId: this.currentStep.id,
        userId: this.uuid
      }
      intoConference(params).then(res => {
        console.log(res, '900')
        if (res.data.code === 200 && res.data.result) {
          window.open(res.data.result)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    enterMeeting(item) {
      this.meetingUrl = item.pxFile.fileUrl
      this.playDialogVisible = true
    },
    searchMember() {
      this.queryAttendMemberList()
    },
    queryConferenceStatistics() {
      const data = {
        serviceId: this.currentStep.id
      }
      fetchConferenceStatistics(data).then(res => {
        if (res.data.code === 200) {
          this.videoStatus.attendCount = res.data.result ? res.data.result.attendCount : 0
          this.videoStatus.liveCount = res.data.result ? res.data.result.liveCount : 0
        }
      })
    },
    getAttendMember() {
      this.memberDialogVisible = true
      this.queryAttendMemberList()
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.queryAttendMemberList()
    },
    handleLinkCurrentChange(index) {
      this.linkPageObj.pageCurrent = index
      this.queryConferenceFile()
    },
    queryAttendMemberList() {
      const data = {
        serviceId: this.currentStep.id,
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize
      }
      if (this.formQuery.attend) {
        data.role = this.formQuery.attend
      }
      if (this.formQuery.username) {
        data.userName = this.formQuery.username
      }
      fetchAttendMemberList(data).then(res => {
        if (res.data.code === 200) {
          this.memberList = res.data.result.list
        }
      })
    },
    queryConferenceFile() {
      const data = {
        pageCurrent: this.linkPageObj.pageCurrent,
        pageSize: this.linkPageObj.pageSize,
        serviceId: this.currentStep.id
      }
      fetchConferenceFile(data).then(res => {
        if (res.data.code === 200) {
          this.vedioPlayList = res.data.result ? res.data.result.records : []
          this.linkPageObj.total = res.data.result ? res.data.result.total : 0
        }
      })
    },
    oneActivityStepRequirement(params) { // 当前环节的要求
      return new Promise((resolve, reject) => {
        oneActivityStepRequirement(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchCourseInfo(params) { // 获取课程基本信息
      return new Promise((resolve, reject) => {
        fetchCourseInfo(params).then(res => {
          resolve(res)
        })
      })
    },
    StepServerList(params) {
      return new Promise((resolve, reject) => {
        StepServerList(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchOneHomeWork(params) {
      return new Promise((resolve, reject) => {
        fetchOneHomeWork(params).then(res => {
          resolve(res)
        })
      })
    },
    contentInfo(params) { // 获取栏目基本信息
      return new Promise((resolve, reject) => {
        contentInfo(params).then(res => {
          resolve(res)
        })
      })
    },
    oneActivityStep(params) { // 当前环节的详情
      return new Promise((resolve, reject) => {
        oneActivityStep(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchCommentPage(params) { // 获取评论list
      return new Promise((resolve, reject) => {
        fetchCommentPage(params).then(res => {
          resolve(res)
        })
      })
    },
    stepComplete(params) {
      return new Promise((resolve, reject) => {
        stepComplete(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activityContent {
  .a-descripe {
    border-bottom: solid 1px #f0f1f1;
    padding-left: 15px;
    /* height: 54px; */
    margin: 0px 8px;
    .a-title {
      border-bottom: solid 3px #00cbac;
      padding: 0px 22px 10px 22px;
      margin-top: 19px;
      display: inline-block;
      margin-bottom: -1px;
    }
    .top-35 {
      top: 35px;
    }
    .homeworImg {
      position: absolute;
      z-index: 1;
      top: 30px;
      right: 30px;
      img {
        margin-left: 20px;
      }
    }
  }
  .N-Information {
    padding: 0px 23px 0px 20px;
    p {
      padding-top: 18px;
    }
  }
  .N-requeris {
    border-bottom: solid 1px #c8cbce;
    // border-radius: 24px;
    width: 95%;
    height: 60px;
    line-height: 42px;
    margin: 15px 18px 0px 18px;
    // padding-bottom: 10px;
    .N-huanjie {
      display: block;
      font-size: 14px;
      color: #8d8d8d;
      padding-left: 25px;
      .n-infor {
        background: url(../../../../static/images/icon0.png) no-repeat left
          center;
        padding-left: 28px;
        height: 40px;
        display: inline-block;
      }
      .displayStyle {
        display: inline-block !important;
        margin-right: 10px;
      }
    }
  }
  .description {
    padding: 15px 25px 15px 35px;
    /deep/ p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
    }
  }
  .N-content {
    // border-radius: 24px;
    width: 95%;
    // height: 60px;
    line-height: 42px;
    margin: 15px 18px 0px 18px;
  }
  .fontSize12 {
    font-size: 12px;
  }
}
</style>

