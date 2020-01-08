<template>
  <div v-loading="courseLoading">
    <div class="container">
      <div class="mt-3">
        <h3>当前课程：{{courseInfo.courseName}}（{{courseInfo.categoryName}}）</h3>
      </div>
    </div>
    <div class="container-fluid" style="background: #27272f;">
      <div class="container">
        <div class="mt-3">
          <div class="media">
            <div class="media-body">
              <div>
                <div class="text-white" style="height: 510px;background: #000;" @mouseover="setTitleShow(3000)">
                  <span style="position: absolute;" v-if="titleShow">{{showContent.fileName}}</span>
                  <kingdom-video
                  style="width: 100%; height: 510px"
                  v-if="videoDone || !showContent.id"
                  :videoObj="showContent"
                  :playObj="learnInfo"
                  :type="transType(showContent.fileType)"
                  :role="role"
                  :userId="uuid"
                  @videoOperate="videoOperate"></kingdom-video>
                  <!-- <img
                  :src="showContent.filePreseeUrl"
                  style="width: 100%; height: 510px"
                  v-if="fileTypes.imgSufs.indexOf(showContent.fileType.toLowerCase()) > -1"> -->
                  <!-- src="http://www.w3school.com.cn/i/movie.ogg" -->
                  <!-- <iframe
                  :src="showContent.filePreseeUrl"
                  style="width: 100%; height: 510px"
                  v-if="fileTypes.docSufs.indexOf(showContent.fileType.toLowerCase()) > -1"/> -->
                </div>
                <div class="text-white" style="background: #1f1f1f; line-height: 50px; border-bottom-right-radius: 5px">
                  <!-- <span class="mr-3 ml-3">下载讲义</span><span class="mr-3">查看任务</span><span class="mr-3">课时介绍</span><span class="mr-3">报告问题</span> -->
                  <el-button type="text" class="mr-3 ml-3" @click="downLoadFile" v-if="showContent.id"><i class="el-icon-download"></i>下载讲义</el-button>
                  <!-- <a class="mr-3 ml-3" v-if="showContent.id" :href="showContent.fileUrl" :download="showContent.fileName">下载讲义</a> -->
                </div>
              </div>
            </div>
            <div class="ml-0" style="width: 300px;">
              <!--目录、提问按钮、评论按钮、笔记按钮-->
              <el-card class="box-card1">
                <div slot="header" class="clearfix">
                  <!-- <span>目录</span> -->
                  <h2>内容提要</h2>
                  <div style="float: right; padding: 0px 0;display:none">
                    <el-button  type="text" size="mini">评论</el-button>
                    <el-button  type="text" size="mini">笔记</el-button>
                    <el-button  type="text" size="mini">提问</el-button>
                  </div>
                </div>
                <!-- <h2>内容提要</h2> -->
                <el-tree :data="parentNodeList" :props="defaultProps" @node-expand="handleNodeExpand" @node-click="handleNodeClick"></el-tree>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="container mt-3">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card shadow="never">
              <el-tabs v-model="tabModel1">
                <el-tab-pane label="主讲人" name="first">{{courseInfo.lecturer}}</el-tab-pane>
                <el-tab-pane label="主讲人简介" name="second">{{courseInfo.lecturerIntroduction}}</el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card shadow="never">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="评论" name="first">
                  <z-z-comment-list
                    @commenthandle="commenthandler"
                    :categoryId="commentedObj.id"
                    :category="commentedObj.type"
                    :categoryName="commentedObj.name"
                    :categoryUrl="commentedObj.url"
                    :userId="uuid"
                    :avatar="userAvatar"
                    :needLogin="false"
                    :loginRouteName="'login'"
                    v-if="commentedObj.id"
                  ></z-z-comment-list>
                </el-tab-pane>
                <!-- <el-tab-pane label="笔记" name="second">笔记</el-tab-pane>
                <el-tab-pane label="问答" name="third">问答</el-tab-pane> courseInfo.description -->
                <el-tab-pane label="课程简介" name="fourth">{{courseInfo.introduction}}</el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchNode, fetchNodeInfo, fetchCourseById, fetchLearnInfosByContentId, fetchLearnInfosByContentIdNoCache, addLearnDuration, refreshLearnDuration } from '@/api/course'
import { fetchFileInfo } from '@/api/file'
import fileService from '@/api/file.js'
import fileTypes from '@/utils/fileType'
import { mapGetters } from 'vuex'
export default {
  components: {
    ZZCommentList: () => import('@/components/comment'),
    kingdomVideo: () => import('@/components/VideoPlay')
  },
  data() {
    return {
      courseLoading: false,
      courseObj: {},
      nodeNames: [],
      nodeList: [],
      parentNodeList: [],
      defaultProps: {
        children: 'childNode',
        label: 'nodeName'
      },
      activeName: 'first',
      tabModel1: 'first',
      showContent: {
        fileType: 'jpg',
        fileUrl: '',
        filePreseeUrl: ''
      },
      fileTypes: fileTypes,
      videoDone: false,
      learnInfo: {},
      role: 'student',
      studyStartTime: 0,
      courseType: '',
      titleShow: false,
      commentedObj: {
        id: '',
        type: '',
        name: '',
        url: ''
      }
    }
  },
  computed: {
    ...mapGetters(['uuid', 'courseUserRoles', 'userAvatar', 'courseInfo'])
  },
  methods: {
    videoOperate(studySecond, currentTime) {
      // 在时间范围内才下发的条件//////////////////后台是否会自动校验时间以区分学习是否有效？？--
      // 开发课程时不下发
      if (this.courseType === 'public') return
      console.log('下发')
      this.learnInfo['learnDuration'] += studySecond
      const totalEfTime = this.learnInfo['effectiveDuration'] + studySecond
      // 有效时长如果大于总时长
      totalEfTime > this.learnInfo['totalDuration'] ? this.learnInfo['effectiveDuration'] = this.learnInfo['totalDuration'] : this.learnInfo['effectiveDuration'] = totalEfTime
      this.learnInfo['lastTimeSign'] = currentTime
      this.learnInfo['learnRate'] = (this.learnInfo['effectiveDuration'] / this.learnInfo['totalDuration']).toFixed(4)
      // 学时是累积的，无修改，只有添加
      addLearnDuration({
        contentId: this.learnInfo.contentId,
        // 后端判断总时间？有效时长加上后超出则后端自动取总时长？
        effectiveDuration: studySecond,
        // 统一使用秒
        lastTimeSign: currentTime + '',
        learnDuration: studySecond,
        totalDuration: this.learnInfo.totalDuration,
        userId: this.uuid || ''
      }).then(() => {
      // addLearnDuration(this.learnInfo).then(() => {
        if (this.courseLoading === 111) {
          // 屏蔽
          refreshLearnDuration()
        }
      })
    },
    handleClick() {

    },
    transType(type) {
      if (this.fileTypes.videoSufs.indexOf(type.toLowerCase()) > -1) {
        return 'video'
      } else if (this.fileTypes.audioSufs.indexOf(type.toLowerCase()) > -1) {
        return 'audio'
      } else if (this.fileTypes.docSufs.indexOf(type.toLowerCase()) > -1) {
        return 'doc'
      } else if (this.fileTypes.imgSufs.indexOf(type.toLowerCase()) > -1) {
        return 'img'
      }
    },
    commenthandler(param) {
      console.log(param)
      if (param.status === 'success') {

      }
    },
    setTitleShow(times) {
      this.titleShow = true
      setTimeout(() => {
        this.titleShow = false
      }, times)
    },
    handleNodeExpand(data, ee) {
      console.log(ee)
      // 查询子节点的子节点
      if (!ee.expanded) return
      data.childNode.forEach(node => {
        // 只查一次
        // if (!data['childDone']) {
        if (node && node.nodeId) {
          // 1-目录-查询子目录
          if (node.nodeType === 1) this.getAllNodes(node.nodeId, node)
          // 2-资源-查询资源列表--欲查询资源列表，需调用查询详情接口
          // if (node.nodeType === 2) this.getAllResource(node.nodeId, node)
          if (node.nodeType === 2) this.getNodeResource(node)
        }
      })
    },
    handleNodeClick(data, ee) {
      // 如果是目录节点，则不管，让expand事件去查询--严格来说这里类型和子节点数需要保持一致
      if (data.childNode.length > 0 || data.nodeType === 1) return false
      // 附件处理--根据文件类型查不同接口查询预览地址或播放地址
      if (data.fileId) {
        this.getFileInfo(data.fileId)
        // 其他类型，切换时直接下发学时
        this.addLearnTime()
      }
    },
    addLearnTime() {
      if (this.studyStartTime > 0) {
        const studySecond = new Date().getTime() - this.studyStartTime
        // 非视频音频类无当前播放时间概念，传0
        this.videoOperate(studySecond, '0')
        this.studyStartTime = 0
      }
    },
    handleChange(val) {
      this.parentNodeList.forEach((parentNode, index) => {
        if (val.indexOf(index) > -1) {
          // 初始化时组装子节点数据
          if (parentNode['childNode'].length < 1) {
            parentNode['childNode'] = this.nodeList.filter(e => { return e.parentId === parentNode.nodeId })
          }
        }
      })
    },
    getNodeResource(node) {
      this.courseLoading = true
      fetchNodeInfo({ id: node.nodeId }).then(res => {
        this.courseLoading = false
        if (res.data.code === 200) {
          node['childDone'] = true
          if (res.data.result['resourceList']) {
            node['childNode'] = res.data.result['resourceList'].map(e => {
              e['nodeName'] = e.fileName
              e['childNode'] = []
              return e
            }) || []
          } else {
            node['childNode'] = []
          }
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    getAllResource(nodeId, node) {
      node['childDone'] = true
      // 将资源伪装成节点以便显示
      if (node['resourceList']) {
        node['childNode'] = node['resourceList'].map(e => {
          e['nodeName'] = e.fileName
          e['childNode'] = []
          return e
        }) || []
      } else {
        node['childNode'] = []
      }
    },
    getCourseById(courseId) {
      if (this.courseInfo && this.courseInfo.courseId) {
        // 包装评论对象
        this.commentedObj = {
          id: '',
          type: '',
          name: '',
          url: ''
        }
        this.$nextTick(() => {
          this.commentedObj = {
            id: this.courseInfo.courseId,
            type: 'course',
            name: this.courseInfo.courseName,
            // url: window.location.origin + '/course/' + res.data.result.courseId + '/' + this.userId
            url: '/course/' + this.courseInfo.courseId
          }
        })
        // 初始化不显示第一个，显示课程信息
        this.showContent.filePreseeUrl = this.courseObj.courseImage || this.courseInfo.courseImage
      } else {
        this.courseLoading = true
        fetchCourseById({
          id: courseId
        }).then(res => {
          this.courseLoading = false
          if (res.data.code === 200) {
            // 包装评论对象
            this.commentedObj = {
              id: '',
              type: '',
              name: '',
              url: ''
            }
            this.$nextTick(() => {
              this.commentedObj = {
                id: res.data.result.courseId,
                type: 'course',
                name: res.data.result.courseName,
                // url: window.location.origin + '/course/' + res.data.result.courseId + '/' + this.userId
                url: '/course/' + res.data.result.courseId
              }
            })
            // 包装成array
            this.courseInfo = res.data.result
            // 初始化不显示第一个，显示课程信息
            this.showContent.filePreseeUrl = this.courseObj.courseImage || this.courseInfo.courseImage
          } else {
            this.$message({ type: 'error', message: res.data.msg })
          }
        })
      }
    },
    getFileInfo(id) {
      this.courseLoading = true
      fetchFileInfo([id]).then(res => {
        this.courseLoading = false
        if (res.data.code === 200) {
          this.showContent = res.data.result[0]
          // 暂时的模拟测试数据
          /* this.showContent = {
            id: 'ad32888c5a2a8be55a0933b09c23c56a',
            fileName: '测试视频.mp4',
            fileCategory: 'video',
            fileType: 'mp4',
            // fileType: 'mp3',
            fileUrl: 'http://hc.yinyuetai.com/uploads/videos/common/D5A001647E6ACB6CE389CE1F02BA6E0A.mp4?sc=0421b437de22b39d&br=779&vid=3247450&aid=26759&area=ML&vst=0',
            fileMd5: '29685bab8278bf66d852f97c8172972a',
            fileKey: 'D5A001647E6ACB6CE389CE1F02BA6E0A.mp4',
            fileSize: '563 KB',
            filePreseeUrl: 'http://hc.yinyuetai.com/uploads/videos/common/D5A001647E6ACB6CE389CE1F02BA6E0A.mp4?sc=0421b437de22b39d&br=779&vid=3247450&aid=26759&area=ML&vst=0'
            // filePreseeUrl: 'http://ting666.yymp3.com:86/new27/underlover/3.mp3'
          } */
          // 获取预览地址
          this.getFilePreSee(this.showContent.id)
          this.setTitleShow(5000)
          // 查询学习情况
          if (this.role === 'student') {
            // this.getLearnTime(this.showContent.id)只有视频音频有学习时长？？图片保存成功但是查不出
            this.getLearnTimeNoCache(this.showContent.id)
          } else {
            this.videoDone = true
          }
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 获取文件预览地址
    getFilePreSee(id) {
      fileService.fetchFilePreSee(id).then(res => {
        this.showContent['filePreseeUrl'] = res.data || this.showContent['filePreseeUrl']
      })
    },
    // 无缓存学时
    getLearnTimeNoCache(contentId) {
      this.courseLoading = true
      this.videoDone = false
      fetchLearnInfosByContentIdNoCache({
        contentId: contentId,
        // contentId: 'ad32888c5a2a8be55a0933b09c23c56a',
        userId: this.uuid || ''
      }).then(res => {
        this.courseLoading = false
        if (res.data.code === 200) {
          this.videoDone = true
          this.learnInfo = res.data.result || {
            contentId: contentId,
            userId: this.uuid || '', // 获取用户id
            totalDuration: 100,
            learnDuration: 0,
            // 统一使用秒（兼容接口，使用string）
            lastTimeSign: '0',
            effectiveDuration: 0,
            learnRate: 0
          }
          // 非视频（音频）类直接开始计时
          if (fileTypes.videoSufs.indexOf(this.showContent.fileType.toLowerCase()) === -1) {
            this.studyStartTime = new Date().getTime()
          }
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 有缓存学时
    getLearnTime(contentId) {
      this.courseLoading = true
      this.videoDone = false
      fetchLearnInfosByContentId({
        // contentId: 'ad32888c5a2a8be55a0933b09c23c56a',
        contentId: contentId,
        userId: this.uuid || ''
      }).then(res => {
        this.courseLoading = false
        if (res.data.code === 200) {
          this.videoDone = true
          this.learnInfo = (res.data.result || [{
            contentId: contentId,
            userId: this.uuid || '', // 获取用户id
            totalDuration: 100,
            learnDuration: 0,
            // 统一使用秒（兼容接口，使用string）
            lastTimeSign: '0',
            effectiveDuration: 0,
            learnRate: 0
          }])[0]
          // 非视频（音频）类直接开始计时
          if (fileTypes.videoSufs.indexOf(this.showContent.fileType.toLowerCase()) === -1) {
            this.studyStartTime = new Date().getTime()
          }
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    downLoadFile() {
      // window.open(this.showContent.fileUrl, '_blank')
      fileTypes.fileDownload(this.showContent.id, this.showContent.fileName, this.showContent.fileType)
    },
    // 查询子节点
    getAllNodes(parentId, node) {
      this.courseLoading = true
      // parentId不传则是查根节点
      fetchNode({ courseId: this.courseObj.id || (this.courseInfo && this.courseInfo.courseId), parentId: parentId || '0' }).then(res => {
        this.courseLoading = false
        if (res.data.code === 200) {
          res.data.result.forEach(e => { e['selected'] = false; e['childNode'] = []; e['childDone'] = false })
          const nodeList = res.data.result || []
          if (node) {
            // 只查一次
            node['childDone'] = true
            node['childNode'] = nodeList
          } else {
          // this.parentNodeList = nodeList.filter(e => { return e.parentId === '0' })
            this.parentNodeList = nodeList
            // 第一次需把二级子节点查出来
            this.parentNodeList.forEach(node => {
              if (node && node.nodeId) {
                // 1-目录-查询子目录
                if (node.nodeType === 1) this.getAllNodes(node.nodeId, node)
              }
            })
          }
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    }
  },
  mounted() {
    this.courseObj = this.$route.query
    this.courseType = this.$route.query.type
    this.getCourseById(this.courseObj.id || (this.courseInfo && this.courseInfo.courseId))
    this.getAllNodes()
    // 初始化不显示第一个，显示课程信息
    this.showContent.filePreseeUrl = this.courseObj.courseImage || this.courseInfo.courseImage
    window.onbeforeunload = (e) => {
      this.playPause()
      // e.returnValue = '确认关闭'
      return '确认关闭'
      // window.showModalDialog()
      // window.alert()
      // window.confirm()
      // window.prompt()
    }
    this.role = this.courseUserRoles.indexOf('GROUP_LEADER') > -1 ? 'teacher'
      : this.courseUserRoles.indexOf('GROUP_USER') > -1 ? 'student'
        : 'visitor'
    // : 'student'
  },
  beforeDestroy() {
    // 销毁、切换时自动提交
    this.addLearnTime()
  }
}
</script>

<style lang="scss">
  .el-collapse-item__header{
    background-color: #28a745;
    color: #fff;
  }
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .list-collapse{
    .list-group-item{
      position: relative;
      font-size: 15px;
      .item-tag{
        position: absolute; left: 10px; top: 12px;
        display: block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #dedede;
      }
    }
    .list-group-title{
      cursor: pointer;
      padding-left: 20px;
      display: block;
      width: 264px;
      overflow: hidden;
      white-space: nowrap;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
    }
    .list-group-title.active{
      color: #28a745;
    }
  }
  .course-img {
    width: 60%;
    img {
      width: 100%;
    }
  }
  .box-card1 {
    background-color:#1f1f1f;
    color: rgba(255,255,255,0.9);
    .el-tree {
      background-color:#1f1f1f;
      color: rgba(255,255,255,0.7);
      font-size: 16px;
      .el-tree-node:focus > .el-tree-node__content {
        color: #1f1f1f !important;
      }
    }
  }
  .el-tree-node__content:hover {
    background-color: #66b1ff87;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #f0f7ff;
  }
</style>
