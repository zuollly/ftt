<template>
  <div>
    <div style="text-align: right">
      <el-button type="warning" size="small" @click="backToList">返回</el-button>
    </div>
    <div v-if="stepNum==='one'" class="activity-add">
      <div style="display: flex">
        <div class="form">
          <el-form :model="form" size="small">
            <el-form-item label="培训名称" :label-width="labelwidth" required>
              <el-input v-model="form.activityName" style="width: 300px" size="small"></el-input>
            </el-form-item>
            <el-form-item label="培训主讲人" :label-width="labelwidth">
              <p v-if="!groupHostInfo.userId">
                <el-button type="text" @click="openAddEventHost">选择主讲人</el-button>
              </p>
              <p v-else>
                <span style="cursor:pointer" @click="openAddEventHost">{{groupHostInfo.realname}}</span>
              </p>
            </el-form-item>
            <el-form-item label="培训日期" :label-width="labelwidth" required>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px" v-model="form.startTime" type="date" placeholder="请选择开始时间"></el-date-picker>
              <span>至</span>
              <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px" type="date" placeholder="请选择结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="培训范围" :label-width="labelwidth" required>
              <!-- <el-radio v-model="activityScope" label="1">全坊</el-radio> -->
              <el-button v-if="!levelInfo.schoolProvinceName" @click="chooseRange" type="text">去选择></el-button>
              <p v-else @click="chooseRange" type="text">{{levelInfo.schoolProvinceName+
                levelInfo.cityName+levelInfo.schoolName}}</p>
            </el-form-item>
            <el-form-item label="参与方式" :label-width="labelwidth">
              <el-checkbox v-model="isApply">报名</el-checkbox>
              <el-checkbox v-model="isInvite">去邀请</el-checkbox>
            </el-form-item>
            <el-form-item v-if="selectMember.length" label="已选择邀请人员" :label-width="labelwidth" required>
              <div>
                <el-tag v-for="(tag, index) in selectMember" :key="index" closable size="mini" @close="handleClose(tag)">{{tag.ucName}}</el-tag>
              </div>
            </el-form-item>
            <el-form-item label="所属工作坊" :label-width="labelwidth">{{workshopInfo.groupName}}</el-form-item>
          </el-form>
        </div>
        <div class="img">
          <el-upload class="avatar-uploader" action="http://192.168.10.92:30440/zuul/tool/file/upload" :headers="headers" name="multipartFile" :show-file-list="false" :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <el-form :model="form">
        <el-form-item label="描述" :label-width="labelwidth">
          <tinymce :value="form.activityDescription" v-model="form.activityDescription" :height="200"></tinymce>
        </el-form-item>
        <el-form-item :label-width="labelwidth">
          <el-button type="primary" size="small" :loading="btnLoading" @click="addActivityInfo" v-if="!form.id && !isPreview">下一步培训环节设置</el-button>
          <el-button type="primary" size="small" :loading="btnLoading" @click="editActivityInfo" v-if="form.id && !isPreview">下一步培训环节编辑</el-button>
        </el-form-item>
      </el-form>
      <!--  -->
      <chooseEventHost ref="chooseEvent" @sureHost="sureHost"></chooseEventHost>
      <addMember ref="addMemberDialog" @leaderInfo="leaderInfo"></addMember>
      <inviteMember :levelInfo="levelInfo" ref="inviteEvent" @sureInviteMember="sureInviteMember"></inviteMember>
    </div>
    <div v-if="stepNum==='two'" class="activity-add">
      <vedioSetting :stepTlist='stepTlist' :getResourcesList='resourcesList'></vedioSetting>
    </div>
  </div>
</template>

<script>
import {
  fetchTemplateById,
  insertActivity,
  insertActivityStage,
  applyTemplate,
  getStageId,
  fetchActivityHolder,
  fetchActivityInfo,
  updateActivity,
  inviteMemberJoinActivity,
  fetchWorkshopMembers,
  insertStepServer,
  updateActivityStep,
  StepServerList,
  activityRelevanceHolder
} from '@/api/activityCopy'
import { fetchJyUserPage } from '@/api/train.js'
import { html2Text } from '@/utils/filters'
import { updateConference } from '@/api/tool.js'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/storage/cookies'
export default {
  components: {
    tinymce: () => import('@/components/tinymce'),
    chooseEventHost: () => import('./chooseEventHost.vue'),
    inviteMember: () => import('./inviteMember.vue'),
    addMember: () => import('./addMember'),
    vedioSetting: () => import('./vedioSetting')
  },
  data() {
    return {
      headers: {
        enctype: 'multipart/form-data',
        Authorization: `Bearer ${getToken()}`
      },
      isApply: false,
      isInvite: false,
      form: { activityDescription: '' },
      labelwidth: '140px',
      currentTemplateInfo: null,
      imageUrl: '',
      templateId: this.$route.query.templateId,
      stageId: '',
      activityScope: '1',
      workshopMemberIds: [],
      groupUser: [],
      groupHostInfo: { userId: '' },
      btnLoading: false,
      levelInfo: {},
      selectMember: [],
      // 关于三个服务
      stepOne: {},
      stepTwo: {},
      stepThree: {},
      stepNum: 'one', // 判断第几步
      resourcesList: [] // 拿到资源服务
    }
  },
  props: ['stepTlist'],
  computed: {
    hasApplyTemplate() {
      // 应用了模板
      return !!this.$route.query.templateId
    },
    isEditActivity() {
      // 是编辑活动
      return !!this.$route.query.activityId
    },
    isPreview() {
      // 是不是预览
      return !!this.$route.query.isPreview
    },
    ...mapGetters(['uuid', 'workshopInfo'])
  },
  watch: {
    async stepTlist(val) {
      await this.stepServer()
      // await this.resetActivityStep()
      // await this.getVideoInteractionId().then(res => {
      //   if (!this.isEditActivity) {
      //     this.stepNum = 'two'
      //   }
      // })
    },
    isInvite(val) {
      if (val) {
        if (!this.levelInfo.schoolProvince && !this.$route.query.activityId) {
          this.$message.warning('请先选择活动范围')
          this.isInvite = false
          return false
        }
        this.$refs.inviteEvent.dialogVisible = true
      }
    }
  },
  mounted() {
    this.getWorkshopMember()
    console.log(this.$route.query, 'this.$route.query')
    if (this.$route.query.activityId) {
      console.log(111111111)
      this.getActivityInfo()
      this.queryJyUserPage()
    } else {
      if (this.hasApplyTemplate) {
        this.templateinfo()
      }
    }
  },
  methods: {
    backToList() {
      this.$router.push({
        name: 'trainingList'
      })
    },
    chooseRange() {
      console.log(9)
      this.$refs.addMemberDialog.dialogTableVisible = true
    },
    leaderInfo(levelInfo) {
      console.log(levelInfo, 'levelInfo')
      if (levelInfo) {
        this.levelInfo = levelInfo
      }
      this.$refs.addMemberDialog.dialogTableVisible = false
    },
    async getActivityInfo() {
      console.log('我有执行')
      await this.fetchActivityInfo({ id: this.$route.query.activityId }).then(res => {
        const currentActivityInfo = res.data.result
        console.log(currentActivityInfo, 'currentActivityInfo')
        if (res.data.code === 200) {
          this.form = currentActivityInfo
          this.imageUrl = currentActivityInfo.activityImg
          this.groupHostInfo = {
            realname: currentActivityInfo.activityManagerName,
            userId: currentActivityInfo.activityManagerId
          }
          this.isApply = currentActivityInfo.isSupportApply === 0
          this.levelInfo = {
            schoolProvinceName: currentActivityInfo.actUserArea,
            cityName: '',
            schoolName: ''
          }
          if (currentActivityInfo.actUserAreaLevel === 'province') {
            this.levelInfo.schoolProvince = currentActivityInfo.actUserAreaCode
          }
          if (currentActivityInfo.actUserAreaLevel === 'city') {
            this.levelInfo.schoolCity = currentActivityInfo.actUserAreaCode
          }
          if (currentActivityInfo.actUserAreaLevel === 'school') {
            this.levelInfo.schoolId = currentActivityInfo.actUserAreaCode
          }
          console.log(this.levelInfo, this.groupHostInfo, 'activityManagerName')
        }
      })
    },
    // 查询邀请的人员
    async queryJyUserPage() {
      const params = {
        category: 1,
        categoryId: this.$route.query.activityId,
        joinType: 0
      }
      await this.fetchJyUserPage(params).then(res => {
        if (res.data.code === 200) {
          const userlist = res.data.result.records.map((item) => {
            return {
              ucName: item.userInfo.realname,
              id: item.userInfo.userId
            }
          })
          console.log(userlist, 'userlist')
          this.selectMember = userlist
        }
      })
    },
    templateinfo() {
      console.log(this.levelInfo, '00000')
      this.fetchTemplateById({ id: this.templateId }).then(res => {
        if (res.data.code === 200) {
          const currentTemplateInfo = res.data.result
          this.form = {
            activityName: currentTemplateInfo.templateName,
            activityThemeCode: currentTemplateInfo.themeCode,
            themeName: currentTemplateInfo.themeName,
            activityDescription: '',
            creatorId: this.$store.state.user.uuid,
            templateId: this.templateId
          }
        }
      })
    },
    openAddEventHost() {
      this.$refs.chooseEvent.dialogVisible = true
    },
    getWorkshopMember() {
      this.getWorkshopMemberAll({
        groupId: this.$route.params.id
      }).then(res => {
        if (res.data.code === 200) {
          console.log('dddd', res)
          // 和后边绑定成员一样，把当前用户去掉，避免设定自己不成功
          this.groupUser = (res.data.result || []).filter(us => {
            return us.userId !== this.uuid
          })
          // 自己拼接，少查一个接口
          // this.workshopMemberIds = this.groupUser.map(usr => {
          //   return usr.userId
          // })
        } else {
          // this.$message.error('获取工作坊成员失败, 请您退出当前页面再重新进入')
          this.$notify.error({
            title: '错误',
            message: '获取工作坊成员失败, 请您退出当前页面再重新进入'
          })
        }
      })
    },
    // 添加环节服务 视频  2个资源分享
    async stepServer(value) {
      console.log(this.stepTlist, 'this.stepTlist')
      this.addServe1()
      this.addServe2()
      this.addServe3()
    },
    addServe1() {
      const tempInfo = this.stepTlist.filter(item => {
        return item.stepSort === 0
      })
      this.stepOne = tempInfo[0]
      const params = {
        serviceTypeCode: 'video_interaction',
        serviceId: tempInfo[0].id,
        stepId: tempInfo[0].id
      }
      this.insertStepServer([params]).then(res => {
        if (res.data.code === 200) {
        } else {
          this.$message.warning('失败')
        }
      })
    },
    addServe2() {
      const tempInfo = this.stepTlist.filter(item => {
        return item.stepSort === 1
      })
      this.stepTwo = tempInfo[0]
      const params = {
        serviceTypeCode: 'resourceShare',
        serviceId: tempInfo[0].id,
        stepId: tempInfo[0].id
      }
      this.insertStepServer([params]).then(res => {
        if (res.data.code === 200) {
        } else {
          this.$message.warning('失败')
        }
      })
    },
    addServe3() {
      const tempInfo = this.stepTlist.filter(item => {
        return item.stepSort === 2
      })
      this.stepThree = tempInfo[0]
      const params = {
        serviceTypeCode: 'resourceShare',
        serviceId: tempInfo[0].id,
        stepId: tempInfo[0].id
      }
      this.insertStepServer([params]).then(res => {
        if (res.data.code === 200) {
          this.getOneActivityStepServerList({ id: tempInfo[0].id })
        } else {
          this.$message.warning('失败')
        }
      })
    },
    getOneActivityStepServerList(params) { // 获取当前活动的服务
      this.resourcesList = []
      return this.StepServerList(params).then(res => {
        if (res.data.code === 200 && res.data.result.length) {
          console.log(res.data.result, 998)
          const resourcesList = []
          res.data.result.forEach(element => {
            resourcesList.push(element)
          })
          this.resourcesList = resourcesList
        }
      })
    },
    // 请求设置会议室
    // getVideoInteractionId() {
    //   const data = {
    //     userId: this.groupHostInfo.userId || this.uuid,
    //     serviceId: this.stepTlist[0].id,
    //     startTime: this.form.startTime,
    //     endTime: this.form.endTime
    //   }
    //   return new Promise((resolve, reject) => {
    //     applyConference(data).then(res => {
    //       resolve(res)
    //     })
    //   })
    // },
    // 更新会议室信息
    updatetVideoInteractionId() {
      const data = {
        userId: this.groupHostInfo.userId || this.uuid,
        serviceId: this.stepTlist[0].id,
        startTime: this.form.startTime,
        endTime: this.form.endTime
      }
      return new Promise((resolve, reject) => {
        updateConference(data).then(res => {
          resolve(res)
        })
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.code === 200) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.activityImg = res.result.fileUrl
      }
    },
    ruleCkeck() {
      if (!this.form.activityName) {
        this.$message.warning('请输入活动名称')
        return false
      }
      if (!this.groupHostInfo.userId) {
        this.$message.warning('请选择主讲人')
        return false
      }
      if (!(this.levelInfo.schoolProvince || this.levelInfo.schoolCity || this.levelInfo.schoolId)) {
        this.$message.warning('请选择培训范围')
        return false
      }
      if (!this.form.activityThemeCode) {
        this.$message.warning('请选择活动主题')
        return false
      }
      if (!this.form.startTime) {
        this.$message.warning('请选择活动开始时间')
        return false
      }
      if (!this.form.endTime) {
        this.$message.warning('请选择活动结束时间')
        return false
      }
      if (this.form.startTime > this.form.endTime) {
        this.$message.warning('请正确的选择活动时间')
        return false
      }
      if (!this.activityScope) {
        this.$message.warning('请选择发布范围')
        return false
      }
      return true
    },
    // 应用模板
    async addActivityInfo() {
      if (!this.ruleCkeck()) {
        return
      }
      this.btnLoading = true
      this.form.activityIntroduction = html2Text(
        this.form.activityDescription
      ).substring(0, 150)
      this.form.groupId = this.$route.params.id
      this.form.activityManagerId = this.groupHostInfo.userId
        ? this.groupHostInfo.userId
        : ''
      this.form.activityManagerName = this.groupHostInfo.userId
        ? this.groupHostInfo.realname
        : ''
      this.form.creatorId = this.uuid
      this.form.isPublic = this.isApply || this.isInvite ? 0 : 1
      this.form.isSupportApply = this.isApply ? 0 : 1 // 报名
      this.form.joinCode =
        this.levelInfo.schoolId ||
        this.levelInfo.schoolCity ||
        this.levelInfo.schoolProvince
      this.form.joinLevel = this.levelInfo.schoolLevel
      this.form.activityStatus = 0
      await this.insertActivity(this.form).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success('新增成功')
          this.form.id = res.data.result // 有id是编辑,没有id就是新增 活动id
          this.$emit('activityId', this.form.id)
          // 保险起见，保留
          // if (this.workshopMemberIds.indexOf(this.uuid) > -1) {
          //   this.workshopMemberIds.splice(this.workshopMemberIds.indexOf(this.uuid), 1)
          // }
          this.stepNum = 'two'
          if (this.hasApplyTemplate) {
            // 应用了模板就调一个方法 应用模板
            this.applyTemplate({
              id: this.templateId,
              activityId: res.data.result
            }).then(res => {
              this.fetchStageId({ unionId: this.form.id }).then(res => {
                if (res.data.code === 200) {
                  this.$emit('stageId', res.data.result[0].id) // 将模板里的stageId拿到
                }
              })
            })
            return
          }
          this.addActivityStage() // 添加活动阶段
        } else {
          this.$message.warning('填写失败')
        }
      })
      await this.bindMember(this.form.id)
      await this.bindActHolder(this.form.id, this.groupHostInfo.userId).then(
        () => {
          this.btnLoading = false
        }
      )
    },
    // 修改环节名称 与活动名称同步
    // async resetActivityStep() {
    //   const params = Object.assign(this.stepInfo, {
    //     stepName: this.form.activityName,
    //     startTime: this.form.startTime,
    //     endTime: this.form.endTime
    //   })
    //   this.updatingActivityStep([params]).then(res => {
    //     console.log(res)
    //     if (res.data.code === 200) {
    //     } else {
    //       this.$message.warning(res.data.msg)
    //     }
    //   })
    // },
    async editActivityInfo() {
      if (!this.ruleCkeck()) {
        return
      }
      delete this.form.joinCode
      delete this.form.joinLevel

      this.btnLoading = true
      this.form.activityIntroduction = html2Text(
        this.form.activityDescription
      ).substring(0, 150)
      this.form.groupId = this.$route.params.id
      this.form.activityManagerId = this.groupHostInfo.userId
        ? this.groupHostInfo.userId
        : ''
      this.form.activityManagerName = this.groupHostInfo.userId
        ? this.groupHostInfo.realname
        : ''
      this.form.isPublic = this.isApply || this.isInvite ? 0 : 1
      this.form.isSupportApply = this.isApply ? 0 : 1 // 报名
      // 如果有改变范围就编辑
      if (this.levelInfo.schoolProvince) {
        this.form.joinCode = this.levelInfo.schoolId ||
          this.levelInfo.schoolCity ||
          this.levelInfo.schoolProvince
        this.form.joinLevel = this.levelInfo.schoolLevel
      }

      console.log(this.groupHostInfo, this.form)
      this.form.creatorId = this.uuid
      this.updateActivity(this.form).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success('更新成功')
        } else {
          this.$message.warning('更新失败')
        }
      })
      await this.bindActHolder(this.form.id, this.groupHostInfo.userId)
      // await this.resetActivityStep()
      await this.bindMember(this.form.id)
      this.updatetVideoInteractionId().then(res => {
        console.log(res)
        this.btnLoading = false
        // this.$router.push({
        //   name: 'trainingList'
        // })
        this.stepNum = 'two'
      })
    },
    async bindMember(actId) {
      if (!this.selectMember.length) {
        return
      } // 没有邀请人
      const inviteUserIds = this.selectMember.map(item => {
        return item.id
      })
      await this.inviteMemberJoinActivity({
        category: 1,
        categoryId: actId,
        joinType: 0,
        operateId: this.uuid,
        userIds: inviteUserIds
      }).then(res => {
        if (res.data.code === 200) {
          console.log(res)
        } else {
          this.$notify.error({
            title: '错误',
            message: '活动发布范围设置失败'
          })
        }
      })
    },
    async bindActHolder(actId, holderId) {
      if (actId && holderId) {
        activityRelevanceHolder({
          userId: holderId,
          activityId: actId
        }).then(res => {
          if (res.data.code === 200) {
            // this.$message.success('指定主讲人成功')
          } else {
            this.$message.error('指定主讲人失败')
          }
        })
      }
    },
    addActivityStage() {
      const params = {
        unionId: this.form.id,
        stageSort: '1',
        stageName: '123',
        stageIntroduction: '132454',
        startTime: '',
        endTime: '',
        description: '123',
        creatorName: '123'
      }
      this.insertActivityStage(params).then(res => {
        if (res.data.code === 200) {
          // 阶段id存起来
          this.stageId = res.data.result
          this.$emit('stageId', res.data.result)
        }
      })
    },
    sureHost(hostMan) {
      console.log(hostMan)
      this.groupHostInfo = hostMan[0]
      this.$refs.chooseEvent.dialogVisible = false
    },
    sureInviteMember(array) {
      console.log(array)
      // 邀请的成员
      if (array.length) {
        this.selectMember = array
      } else {
        this.isInvite = false
      }
      this.$refs.inviteEvent.dialogVisible = false
    },
    handleClose(tag) {
      console.log(tag)
      for (let index = 0; index < this.selectMember.length; index++) {
        const element = this.selectMember[index]
        if (element.id === tag.id) {
          this.selectMember.splice(index, 1)
          break
        }
      }
    },
    /* axios----- */
    fetchTemplateById(params) {
      return new Promise((resolve, reject) => {
        fetchTemplateById(params).then(res => {
          resolve(res)
        })
      })
    },
    insertStepServer(params) {
      return new Promise((resolve, reject) => {
        insertStepServer(params).then(res => {
          resolve(res)
        })
      })
    },
    updatingActivityStep(params) {
      return new Promise((resolve, reject) => {
        updateActivityStep(params).then(res => {
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
    insertActivity(params) {
      return new Promise((resolve, reject) => {
        insertActivity(params).then(res => {
          resolve(res)
        })
      })
    },
    insertActivityStage(params) {
      // 活动的阶段, 先暂时在模板的基本信息填写了之后加一个阶段, 参数随便写的
      return new Promise((resolve, reject) => {
        insertActivityStage(params).then(res => {
          resolve(res)
        })
      })
    },
    applyTemplate(params) {
      // 将某一个模板应用于活动, 应用之后模板下面的环节和阶段都会直接被复制到活动下面
      return new Promise((resolve, reject) => {
        applyTemplate(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchStageId(params) {
      return new Promise((resolve, reject) => {
        getStageId(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchJyUserPage(params) {
      // 获取活动详情
      return new Promise((resolve, reject) => {
        fetchJyUserPage(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchActivityInfo(params) {
      // 获取活动详情
      return new Promise((resolve, reject) => {
        fetchActivityInfo(params).then(res => {
          resolve(res)
        })
      })
    },
    getActHoder(activityId) {
      return new Promise((resolve, reject) => {
        fetchActivityHolder({
          roleCode: 'ACT_HOST',
          activityId: activityId
        }).then(res => {
          if (res.data.code === 200) {
            resolve(res)
          }
        })
      })
    },
    updateActivity(params) {
      return new Promise((resolve, reject) => {
        updateActivity(params).then(res => {
          resolve(res)
        })
      })
    },
    getWorkshopMemberAll(params) {
      return new Promise((resolve, reject) => {
        fetchWorkshopMembers(params).then(res => {
          resolve(res)
        })
      })
    },
    inviteMemberJoinActivity(params) {
      return new Promise((resolve, reject) => {
        inviteMemberJoinActivity(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.activity-add {
  // display: flex;
  .form {
    flex: 2;
    min-width: 600px;
  }
  .img {
    flex: 3;
  }
  .avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader /deep/ .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
