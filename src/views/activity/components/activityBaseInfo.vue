<template>
  <div class="activity-add">
    <div style="display: flex">
    <div class="form">
      <el-form :model="form" size="small">
        <el-form-item label="活动名称" :label-width="labelwidth" required>
          <el-input v-model="form.activityName" style="width: 300px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="活动主题" :label-width="labelwidth" required>
          <span v-if="!notApplyTemplate">{{form.themeName}}</span>
          <el-select v-model="form.activityThemeCode" placeholder="请选择活动主题" size="small">
            <el-option
              v-for="item in themeCodeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动主持人" :label-width="labelwidth">
          <p v-if="!groupHostInfo.userId"><el-button type="text" @click="openAddEventHost">选择活动主持人</el-button></p>
          <p v-else><span style="cursor:pointer" @click="openAddEventHost">{{groupHostInfo.realname}}</span></p>
          <!-- <el-select v-model="form.holder" placeholder="请选择活动主持人" size="small" v-if="refS">
            <el-option
              v-for="item in groupUser"
              :key="item.userId"
              :label="item.realname"
              :value="item.userId">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="活动时间" :label-width="labelwidth" required>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 150px"
            v-model="form.startTime"
            type="date"
            placeholder="请选择开始时间">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="form.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 150px"
            type="date"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布范围" :label-width="labelwidth" required>
          <el-radio v-model="activityScope" label="1">全坊</el-radio>
        </el-form-item>
        <el-form-item label="活动关键词" :label-width="labelwidth">
          <el-input v-model="form.activityKeyword" style="width: 300px" size="small"></el-input>
        </el-form-item>
        <!-- <el-form-item label="学段学科" :label-width="labelwidth">
          <el-button type="text" size="small" @click="selectStudy">选择学段学科</el-button>
          <p style="margin: 0" v-if="studyphaseToSubject.length">已选择：{{studyphaseToSubject.join(' 、')}}</p>
        </el-form-item>
        <el-form-item label="是否进行考核" :label-width="labelwidth">
          <el-radio v-model="form.isAssess" :label="0">日常</el-radio>
          <el-radio v-model="form.isAssess" :label="1">考核</el-radio>
        </el-form-item>
        <el-form-item label="是否公开" :label-width="labelwidth">
          <el-radio v-model="form.isPublic" :label="0">不公开</el-radio>
          <el-radio v-model="form.isPublic" :label="1">公开</el-radio>
        </el-form-item>
        <el-form-item label="成员是否支持申请" :label-width="labelwidth">
          <el-radio v-model="form.isSupportApply" :label="0">支持</el-radio>
          <el-radio v-model="form.isSupportApply" :label="1">不支持</el-radio>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="img">
      <el-upload
        class="avatar-uploader"
        action="http://yx.nercel.cn/msapi/zuul/tool/file/upload"
        :headers="headers"
        name="multipartFile"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    </div>
    <el-form :model="form">
      <el-form-item label="活动描述" :label-width="labelwidth">
        <tinymce :value='form.activityDescription' v-model="form.activityDescription" :height='200'></tinymce>
      </el-form-item>
      <el-form-item :label-width="labelwidth">
        <el-button type="primary" size="small" @click="addActivityInfo" v-if="!form.id && !isPreview">确 定</el-button>
        <el-button type="primary" size="small" @click="editActivityInfo" v-if="form.id && !isPreview">确 定</el-button>
        <el-button type="primary" size="small" @click="backTo">返回</el-button>
      </el-form-item>
    </el-form>
    <!--  -->
    <!-- <study-phase ref="studyPhase" @studyPhase='studyPhase' :select='selectStudyphase'></study-phase> -->
    <chooseEventHost ref="chooseEvent" @sureHost='sureHost'></chooseEventHost>

  </div>
</template>

<script>
import { fetchTemplateById, fetchActivityTheme, insertActivity, insertActivityStage, applyTemplate, getStageId, fetchActivityHolder,
  fetchActivityInfo, updateActivity, inviteMemberJoinActivity, fetchWorkshopMembers, fetchWorkshopMember, activityRelevanceHolder } from '@/api/activityCopy'
import { html2Text } from '@/utils/filters'
import { mapGetters } from 'vuex'
export default {
  components: {
    tinymce: () => import('@/components/tinymce'),
    chooseEventHost: () => import('./chooseEventHost.vue')
    // studyPhase: () => import('./studyPhase.vue')
  },
  data() {
    return {
      headers: {
        'enctype': 'multipart/form-data',
        'Authorization': 'Bearer 8c1e6fb0-c9ee-45bc-8572-9a8584c3b350'
      },
      form: { activityDescription: '' },
      labelwidth: '140px',
      themeCodeOptions: [],
      currentTemplateInfo: null,
      imageUrl: '',
      gradeOption: [],
      templateId: this.$route.query.templateId,
      stageId: '',
      studyphaseToSubject: [],
      selectStudyphase: [],
      activityScope: '1',
      workshopMemberIds: [],
      groupUser: [],
      groupHostInfo: { userId: '' },
      refS: true
    }
  },
  props: ['activityId'],
  computed: {
    notApplyTemplate() { // 应用了模板
      return !!this.$route.query.templateId
    },
    isEditActivity() { // 是不是编辑活动
      return !!this.$route.query.activityId
    },
    isPreview() { // 是不是预览
      return !!this.$route.query.isPreview
    },
    ...mapGetters(['kingdomInfo', 'kingdomId', 'workshopId', 'uuid'])
  },
  mounted() {
    console.log(this.$route.query, this.notApplyTemplate, this.form.id)
    this.getWorkshopMember()
    this.getActivityTheme()
    if (this.activityId) {
      console.log(9999)
      this.getActivityInfo()
    } else {
      if (this.notApplyTemplate) {
        this.templateinfo()
      }
      // if (this.isEditActivity) {
      //   this.getActivityInfo()
      // }
    }
  },
  methods: {
    async getActivityInfo() {
      await this.fetchActivityInfo({ id: this.activityId }).then(res => {
        const currentActivityInfo = res.data.result
        console.log(currentActivityInfo, 'currentActivityInfo')
        if (res.data.code === 200) {
          this.form = currentActivityInfo
          this.imageUrl = currentActivityInfo.activityImg
          this.groupHostInfo = { realname: currentActivityInfo.activityManagerName, userId: currentActivityInfo.activityManagerId }
          this.selectStudyphase = []
          this.studyphaseToSubject = []
          if (this.form.segSubVOs) {
            this.studyphaseToSubject = this.form.segSubVOs.map(el => {
              this.selectStudyphase.push(el.segsubId)
              return el.segName + ' - ' + el.subName
            })
          }
        }
      })
      this.getActHoder(this.activityId).then(res => {
        // this.form.holder = res.data.result && res.data.result.userInfo && res.data.result.userInfo.userId
        this.$set(this.form, 'holder', res.data.result && res.data.result.userInfo && res.data.result.userInfo.userId)
      })
    },
    templateinfo() {
      this.fetchTemplateById({ id: this.templateId }).then(res => {
        if (res.data.code === 200) {
          const currentTemplateInfo = res.data.result
          this.form = {
            activityName: currentTemplateInfo.templateName,
            activityThemeCode: currentTemplateInfo.themeCode,
            themeName: currentTemplateInfo.themeName,
            activityKeyword: currentTemplateInfo.keyWords,
            activityDescription: '',
            creatorId: this.$store.state.user.uuid,
            templateId: this.templateId
          }
        }
      })
    },
    getActivityTheme() {
      this.fetchActivityTheme().then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.themeCodeOptions = res.data.result.map(el => {
            return { value: el.themeCode, label: el.themeName }
          })
        }
      })
    },
    openAddEventHost() {
      this.$refs.chooseEvent.dialogVisible = true
    },
    getWorkshopMember() {
      /* this.fetchWorkshopMemberIds({
        projectId: this.kingdomId,
        roleScopeId: this.workshopId
      }).then(res => {
        if (res.data.code === 200) {
          console.log('ccccc', res)
          this.workshopMemberIds = res.data.result || []
        } else {
          // this.$message.error('获取工作坊成员失败, 请您退出当前页面再重新进入')
          this.$notify.error({
            title: '错误',
            message: '获取工作坊成员失败, 请您退出当前页面再重新进入'
          })
        }
      }) */
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
          this.workshopMemberIds = this.groupUser.map(usr => {
            return usr.userId
          })
        } else {
          // this.$message.error('获取工作坊成员失败, 请您退出当前页面再重新进入')
          this.$notify.error({
            title: '错误',
            message: '获取工作坊成员失败, 请您退出当前页面再重新进入'
          })
        }
      })
    },
    beforeAvatarUpload() {

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
      if (!this.form.activityThemeCode) {
        this.$message.warning('请选择活动主题')
        return false
      }
      // if (!this.groupHostInfo) {
      //   this.$message.warning('请选择活动主持人')
      //   return false
      // }
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
    async addActivityInfo() {
      if (!this.ruleCkeck()) {
        return
      }
      this.form.activityIntroduction = html2Text(this.form.activityDescription).substring(0, 150)
      this.form.groupId = this.$route.params.id
      this.form.activityManagerId = this.groupHostInfo ? this.groupHostInfo.userId : ''
      // this.form.activityManagerName = this.groupHostInfo.realname
      this.form.creatorId = this.uuid
      await this.insertActivity(this.form).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success('填写成功')
          this.form.id = res.data.result // 有id是编辑,没有id就是新增 活动id
          this.$emit('activityId', this.form.id)
          // this.activityRelevanceWorkshop({ activityId: res.data.result,
          //   categoryId: this.$route.params.id,
          //   category: 'workshop',
          //   userId: this.uuid })
          //   .then(res => {
          //     if (res.data.code !== 200) {
          //       // this.$message.warning('活动关联工作坊失败')
          //       this.$notify.error({
          //         title: '错误',
          //         message: '活动关联工作坊失败'
          //       })
          //     }
          //   })
          // 保险起见，保留
          if (this.workshopMemberIds.indexOf(this.uuid) > -1) {
            this.workshopMemberIds.splice(this.workshopMemberIds.indexOf(this.uuid), 1)
          }
          if (this.notApplyTemplate) { // 应用了模板就调一个方法
            this.applyTemplate({ id: this.templateId, activityId: res.data.result }).then(res => {
              this.fetchStageId({ unionId: this.form.id }).then(res => {
                if (res.data.code === 200) {
                  this.$emit('stageId', res.data.result[0].id)
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
      await this.bindActHolder(this.form.id, this.form.holder)
    },
    editActivityInfo() {
      if (!this.ruleCkeck()) {
        return
      }
      this.form.activityIntroduction = html2Text(this.form.activityDescription).substring(0, 150)
      this.updateActivity(this.form).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success('更新成功')
        } else {
          this.$message.warning('更新失败')
        }
      })
      this.bindActHolder(this.form.id, this.form.holder)
    },
    async bindMember(actId) {
      await this.inviteMemberJoinActivity({
        category: 1,
        categoryId: actId,
        joinType: 0,
        operateId: this.uuid,
        userIds: this.workshopMemberIds
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
            // this.$message.success('指定主持人成功')
          } else {
            this.$message.error('指定主持人失败')
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
    studyPhase(value, studyphaseToSubject) {
      // this.form.segmentRelSubjects = value
      this.form.segsubCodes = value
      this.studyphaseToSubject = studyphaseToSubject
    },
    sureHost(hostMan) {
      console.log(hostMan)
      this.groupHostInfo = hostMan[0]
      this.$refs.chooseEvent.dialogVisible = false
    },
    backTo() {
      if (this.isEditActivity) { // 编辑则是从列表页而来
        this.$router.push({
          name: 'activityList' })
        return
      }
      this.$router.push({
        name: 'activityAdd' })
    },
    /* axios----- */
    fetchTemplateById(params) {
      return new Promise((resolve, reject) => {
        fetchTemplateById(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchActivityTheme() { // 开启的活动模板
      return new Promise((resolve, reject) => {
        fetchActivityTheme().then(res => {
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
    // activityRelevanceWorkshop(params) { // 活动关联工作坊
    //   return new Promise((resolve, reject) => {
    //     activityRelevanceWorkshop(params).then(res => {
    //       resolve(res)
    //     })
    //   })
    // },
    insertActivityStage(params) { // 活动的阶段, 先暂时在模板的基本信息填写了之后加一个阶段, 参数随便写的
      return new Promise((resolve, reject) => {
        insertActivityStage(params).then(res => {
          resolve(res)
        })
      })
    },
    applyTemplate(params) { // 将某一个模板应用于活动, 应用之后模板下面的环节和阶段都会直接被复制到活动下面
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
    fetchActivityInfo(params) { // 获取活动详情
      return new Promise((resolve, reject) => {
        fetchActivityInfo(params).then(res => {
          resolve(res)
        })
      })
    },
    getActHoder(activityId) {
      return new Promise((resolve, reject) => {
        fetchActivityHolder({ roleCode: 'ACT_HOST', activityId: activityId }).then(res => {
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
    fetchWorkshopMemberIds(params) {
      return new Promise((resolve, reject) => {
        fetchWorkshopMember(params).then(res => {
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
    border-color: #409EFF;
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
