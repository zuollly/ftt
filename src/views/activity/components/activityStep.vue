<template>
  <div>
    <!--  -->
    <div class="stageBox">
      <div class="right">
        <el-form ref="form" :model="currentStepInfo" label-width="120px" size="small">
          <el-form-item label="环节名称：" required>
            <el-input v-model="currentStepInfo.stepName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="环节类型：">
            <span>{{currentStepInfo.stepTypeName}}</span>
            <!-- <el-select v-model="currentStepInfo.stepTypeCode" placeholder="请选择">
              <el-option
                v-for="item in stepTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
          <!-- <el-form-item label="环节时间：">
            <el-date-picker
              v-model="currentStepInfo.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <el-date-picker
              v-model="currentStepInfo.endTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
          <!-- <el-form-item label="环节简介：">
            <div v-html="currentStepInfo.stepIntroduction"></div>
          </el-form-item> -->
          <!-- <el-form-item label="环节要求：">
            <p><el-button type="text" @click="openAddStepRequirement">添加环节要求</el-button></p>
            <p v-for="(item, index) in currentStepRequirement" :key="index">
              <span>{{item.stepRequirementName.replace(/%%/g, '')}}：</span><span>{{item.stepRequirementData}}</span>
              <span><el-button type="text" @click="openEditStepRequirement(item)">编辑</el-button></span>
              <span><el-button type="text" @click="delStepRequirement([item.id])">删除</el-button></span>
            </p>
            <div v-if="addStepRequirementShow">
              <span>要求类型：</span>
              <el-select v-model="addStepRequirementForm.stepRequirementCode" @change="handleRequirementTypeChange" placeholder="请选择环节要求类型">
                <el-option
                  v-for="item in currentStepRequirementTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-if="addStepRequirementShow">
              <span>环节要求：</span>
              <span>{{addStepRequirementForm.requirement}} <el-input v-model="addStepRequirementForm.stepRequirementData" style="width: 150px"></el-input></span>
            </div>
            <div v-if="addStepRequirementShow">
              <el-button type="text" @click="addStepRequirement">确定</el-button>
              <el-button type="text" @click="addStepRequirementShow = false">取消</el-button>
            </div>
          </el-form-item> -->
          <el-form-item label="环节服务：" :required="currentStepInfo.stepTypeName === '讨论'">
            <p>
              <el-button type="text" @click="openAddStepServer">添加环节服务</el-button>
            </p>
            <div v-for="(item, index) in stepServerList" :key="index">
              <p v-if="item.serverInfo.serviceTypeCode == 'homeWork'">作业：{{item.serverInfo.title}}
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
              <p v-if="item.serverInfo.serviceTypeCode == 'course'">课程：{{item.serverInfo.courseName}}
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
              <p v-if="item.serverInfo.serviceTypeCode == 'channel'">内容：{{item.serverInfo.title}}
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
              <p v-if="item.serverInfo.serviceTypeCode == 'comment'">讨论：开展讨论
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
              <p v-if="item.serverInfo.serviceTypeCode == 'resourceShow'">资源：资源展示
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
              <p v-if="item.serverInfo.serviceTypeCode == 'resourceShare'">资源：资源分享
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
              <p v-if="item.serverInfo.serviceTypeCode == 'video_interaction'">教研：互动教研
                <span>
                  <el-button type="text" @click="delStepServer([item.stepServer.id])">删除</el-button>
                </span>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="环节描述：">
            <tinymce :value='currentStepInfo.description' v-if="tinymceShow" v-model="currentStepInfo.description"></tinymce>
          </el-form-item>
          <el-form-item v-if="!isPreview">
            <el-button type="primary" @click="sureBtn">保存环节</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--  -->
    <add-step-server ref="addStepServer" @stepServer='stepServer' :stepId='stepId' :activityId='activityId' :select='selectStepServer' :hasServerCode='hasServerCode'></add-step-server>
  </div>
</template>

<script>
import {
  activityStepList, oneActivityStep, oneActivityStepRequirement, oneStepRequirementTypeList, activityStepTypeList, deleteActivityStep,
  addStepRequirement, updateStepRequirement, deleteStepRequirement, insertActivityStep, updateActivityStep, insertStepServer, StepServerList,
  fetchCourseInfo, fetchOneHomeWork, contentInfo, deleteStepServer
} from '@/api/activityCopy'
import { html2Text } from '@/utils/filters'
import { mapGetters } from 'vuex'
export default {
  components: {
    tinymce: () => import('@/components/tinymce'),
    // addStep: () => import('./addStep.vue'),
    addStepServer: () => import('./addStepServer.vue')
  },
  data() {
    return {
      form: { description: '' },
      addStepShow: false,
      stepTypeOptions: [],
      currentStepInfo: { description: '' }, // 当前环节的基本信息
      currentStepRequirement: [], // 当前环节的要求
      currentStepRequirementTypeOption: [], // 当前环节的要求类型
      addStepRequirementShow: false,
      isEditRequirement: false, // 是编辑要求还是新增要求
      stepForm: {},
      stepList: [],
      stepActive: [],
      tinymceShow: true,
      addStepRequirementForm: { requirement: '' },
      isEdit: false,
      stepServerList: [],
      hasServerCode: []
      // stageId: '68d58bef708de33ce44f7bdce9914d6d' // 暂时写死
    }
  },
  props: {
    stageId: { // 模板的阶段id
      type: String,
      default: ''
    },
    stepId: {
      type: String,
      required: true
    },
    activityId: {
      type: String
    }
  },
  watch: {
    'stageId': {
      handler() {
        this.getStepInfo()
      },
      deep: true,
      immediate: true
    },
    'stepId': {
      handler() {
        this.tinymceShow = false
        this.getStepInfo()
      },
      deep: true,
      immediate: true
    },
    stepServerList(val) {
      const hasServerCode = val.map(ele => {
        return ele.stepServer.serviceTypeCode
      })
      this.hasServerCode = [...hasServerCode]
    }
  },
  computed: {
    notApplyTemplate() { // 没有应用模板
      return !this.$route.query.templateId
    },
    selectStepServer() { // 环节服务对应的服务集合
      if (!this.stepServerList.length) {
        return []
      }
      return this.stepServerList.map(el => {
        return el.stepServer.serviceTypeCode
      })
    },
    isPreview() { // 是不是预览
      return !!this.$route.params.isPreview
    },
    notWriteBaseInfo() { // 应用了模板但是没有填写活动的基本信息
      return !this.notApplyTemplate && !this.activityId
    },
    ...mapGetters(['kingdomInfo'])
  },
  mounted() {
    console.log(this.$route.params)
    this.getStepInfo()
    this.getStepTypeList()
  },
  methods: {
    async getStepInfo() { // 环节list
      await this.getOneActivityStepInfo({ stepId: this.stepId }) // 暂时先传第一个
      this.getOneStepRequirementTypeList({ stepTypeCode: this.currentStepInfo.stepTypeCode })
      this.getOneActivityStepRequirement({ id: this.stepId })
      this.getOneActivityStepServerList({ id: this.stepId })
    },
    getStepTypeList() {
      this.activityStepTypeList().then(res => {
        if (res.data.code === 200) {
          this.stepTypeOptions = res.data.result.map(el => {
            return { value: el.typeCode, label: el.typeName }
          })
        }
      })
    },
    stepClick(item, index) {
      this.tinymceShow = false // 因为富文本的数据改变但是视图没有更新
      this.getOneActivityStepInfo({ stepId: item.id })
      this.getOneStepRequirementTypeList({ stepTypeCode: item.stepTypeCode })
      this.getOneActivityStepRequirement({ id: item.id })
      this.getOneActivityStepServerList({ id: item.id })
      this.stepActive = Array(this.stepList.length).fill(false)
      this.stepActive[index] = true
    },
    getOneActivityStepInfo(params) { // 当前环节的详情
      return this.oneActivityStep(params).then(res => { // 利用es7的async此处必须写return
        if (res.data.code === 200) {
          this.currentStepInfo = res.data.result
          this.currentStepInfo.description = res.data.result.description ? res.data.result.description : ''
          // 起止时间改为当前
          // if (!this.activityId) {
          //   this.currentStepInfo.startTime = new Date()
          //   this.currentStepInfo.endTime = new Date()
          // }
          this.tinymceShow = true
        }
      })
    },
    getOneActivityStepRequirement(params) { // 获取当前环节的要求
      this.oneActivityStepRequirement(params).then(res => {
        if (res.data.code === 200) {
          this.currentStepRequirement = res.data.result
        }
      })
    },
    getOneStepRequirementTypeList(params) { // 获取当前环节的要求类型
      this.oneStepRequirementTypeList(params).then(res => {
        if (res.data.code === 200) {
          this.currentStepRequirementTypeOption = res.data.result.map(el => {
            return { value: el.stepRequirementCode, label: el.stepRequirementIntroduction, name: el.stepRequirementName }
          })
        }
      })
    },
    handleRequirementTypeChange(value) {
      console.log(value)
      const currentRequirement = this.currentStepRequirementTypeOption.filter(el => {
        return el.value === value
      })
      this.addStepRequirementForm.requirement = currentRequirement[0].name.replace(/%%/g, '')
    },
    getOneActivityStepServerList(params) { // 获取当前活动的服务
      this.StepServerList(params).then(res => {
        console.log(res, 'res')
        const stepServerList = []
        if (res.data.code === 200 && res.data.result.length) {
          const p = []
          res.data.result.forEach(el => {
            if (el.serviceTypeCode === 'course' && el.serviceId) {
              const p1 = this.fetchCourseInfo({ id: el.serviceId }).then(res => {
                if (res.data.code === 200) {
                  res.data.result.serviceTypeCode = 'course'
                  stepServerList.push({ serverInfo: res.data.result, stepServer: el })
                }
              })
              p.push(p1)
            }
            if (el.serviceTypeCode === 'homeWork' && el.serviceId) {
              const p2 = this.fetchOneHomeWork({ id: el.serviceId }).then(res => {
                if (res.data.code === 200) {
                  res.data.result.serviceTypeCode = 'homeWork'
                  stepServerList.push({ serverInfo: res.data.result, stepServer: el })
                }
              })
              p.push(p2)
            }
            if (el.serviceTypeCode === 'channel' && el.serviceId) {
              const p3 = this.contentInfo({ id: el.serviceId }).then(res => {
                if (res.data.code === 200) {
                  res.data.result.serviceTypeCode = 'channel'
                  stepServerList.push({ serverInfo: res.data.result, stepServer: el })
                }
              })
              p.push(p3)
            }
            if (el.serviceTypeCode === 'comment') {
              stepServerList.push({ serverInfo: { serviceTypeCode: 'comment' }, stepServer: el })
            }
            if (el.serviceTypeCode === 'resourceShow') {
              stepServerList.push({ serverInfo: { serviceTypeCode: 'resourceShow' }, stepServer: el })
            }
            if (el.serviceTypeCode === 'resourceShare') {
              stepServerList.push({ serverInfo: { serviceTypeCode: 'resourceShare' }, stepServer: el })
            }
            if (el.serviceTypeCode === 'video_interaction') {
              stepServerList.push({ serverInfo: { serviceTypeCode: 'video_interaction' }, stepServer: el })
            }
          })
          console.log(p, 'p')
          Promise.all(p).then(res => {
            this.stepServerList = stepServerList
          })
        } else {
          this.stepServerList = []
        }
      })
    },
    getOneActivityStepServerType() { // 获取当前活动的服务类型
      this.activityStepServerOptions = [ // 暂时写死
        { value: 'homeWork', label: '作业' },
        { value: 'course', label: '课程' },
        { value: 'channel', label: '内容' }
      ]
    },
    delStepServer(params) {
      if (this.notWriteBaseInfo) {
        this.$message.warning('请先填写活动的基本信息')
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStepServer(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.getOneActivityStepServerList({ id: this.stepId })
          } else {
            this.$message.warning('删除失败')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    openAddStepRequirement() {
      if (this.notWriteBaseInfo) {
        this.$message.warning('请先填写活动的基本信息')
        return
      }
      this.addStepRequirementForm = {}
      this.isEditRequirement = false
      this.addStepRequirementShow = true
    },
    addStepRequirement() { // 添加和编辑环节要求
      const params = {
        stepId: this.currentStepInfo.id,
        stepRequirementCode: this.addStepRequirementForm.stepRequirementCode,
        stepRequirementData: this.addStepRequirementForm.stepRequirementData
      }
      if (this.isEditRequirement) {
        params.id = this.addStepRequirementForm.id
        this.updateStepRequirement([params]).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
            this.addStepRequirementShow = false
            this.addStepRequirementForm = {}
            this.getOneActivityStepRequirement({ id: this.currentStepInfo.id })
          } else {
            this.$message.warning('修改失败')
          }
        })
      } else {
        this.insertStepRequirement([params]).then(res => {
          if (res.data.code === 200) {
            this.$message.success('添加成功')
            this.addStepRequirementShow = false
            this.addStepRequirementForm = {}
            this.getOneActivityStepRequirement({ id: this.currentStepInfo.id })
          } else {
            this.$message.warning('添加失败')
          }
        })
      }
    },
    delStepRequirement(params) {
      if (this.notWriteBaseInfo) {
        this.$message.warning('请先填写活动的基本信息')
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStepRequirement(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.getOneActivityStepRequirement({ id: this.currentStepInfo.id })
          } else {
            this.$message.warning('删除失败')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    openEditStepRequirement(item) {
      console.log(item)
      if (this.notWriteBaseInfo) {
        this.$message.warning('请先填写活动的基本信息')
        return
      }
      this.isEditRequirement = true
      this.addStepRequirementShow = true
      this.addStepRequirementForm = JSON.parse(JSON.stringify(item))
      this.addStepRequirementForm.requirement = item.stepRequirementName.replace(/%%/g, '')
    },
    openAddStepServer() {
      console.log(this.notWriteBaseInfo, this.notApplyTemplate, this.activityId)
      if (this.notWriteBaseInfo) {
        this.$message.warning('请先填写活动的基本信息')
        return
      }
      this.$refs.addStepServer.dialogTableVisible = true
    },
    stepServer(value) {
      console.log(value, 'value')
      const params = {
        serviceTypeCode: value.code,
        serviceId: value.id,
        stepId: this.currentStepInfo.id
      }
      console.log(value)
      if (value.id === 'isComment' || value.id === 'isResourcesShow' || value.id === 'isResourcesShare' || value.id === 'video_interaction') {
        params.serviceId = this.currentStepInfo.id
      }
      this.insertStepServer([params]).then(res => {
        if (res.data.code === 200) {
          this.$message.success('成功')
          this.getOneActivityStepServerList({ id: this.currentStepInfo.id })
        } else {
          this.$message.warning('失败')
        }
      })
    },
    addStep() {
      this.addStepShow = true
      this.isEdit = null
    },
    editStep() {
      this.addStepShow = true
      this.isEdit = this.currentStepInfo
    },
    delStep() {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteActivityStep([this.currentStepInfo.id]).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.getStepInfo()
          } else {
            this.$message.warning('删除失败')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    ruleCheck() {
      if (!this.currentStepInfo.stepName.trim()) {
        this.$message.warning('请填写环节名称')
        return false
      }
      // if (!this.currentStepInfo.startTime) {
      //   this.$message.warning('请选择环节开始时间')
      //   return false
      // }
      // if (this.currentStepInfo.startTime < this.kingdomInfo.startTime) {
      //   this.$message.warning('环节开始时间不能早于项目开始时间')
      //   return false
      // }
      // if (!this.currentStepInfo.endTime) {
      //   this.$message.warning('请选择环节结束时间')
      //   return false
      // }
      // if (this.currentStepInfo.startTime > this.currentStepInfo.endTime) {
      //   this.$message.warning('请正确选择时间')
      //   return false
      // }
      // if (this.currentStepInfo.endTime > this.kingdomInfo.endTime) {
      //   this.$message.warning('环节结束时间不能晚于项目结束时间')
      //   return false
      // }
      if (this.currentStepInfo.stepTypeName === '讨论') {
        if (!this.stepServerList.length) {
          this.$message.warning('环节类型为讨论时必须添加讨论环节服务')
          return false
        }
      }
      return true
    },
    sureBtn() {
      if (!this.activityId) {
        this.$message.warning('请先填写活动的基本信息')
        return
      }
      if (!this.ruleCheck()) {
        return
      }
      const params = Object.assign(this.currentStepInfo, {
        stageId: this.stageId,
        stepIntroduction: html2Text(this.currentStepInfo.description).substring(0, 150)
      })
      // params.stepSort = 0
      this.updateActivityStep([params]).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          // this.$emit('addStepSuccess', res.data.result)
          this.$message.success('成功')
          this.getStepInfo()
          this.$emit('updateStep')
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    addStepSuccess(res) {
      console.log(res)
      this.addStepShow = false
      if (res) {
        this.getStepInfo()
      }
    },
    /* axios------ */
    activityStepList(params) {
      return new Promise((resolve, reject) => {
        activityStepList(params).then(res => {
          resolve(res)
        })
      })
    },
    activityStepTypeList() {
      return new Promise((resolve, reject) => {
        activityStepTypeList().then(res => {
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
    oneActivityStepRequirement(params) { // 当前环节的要求
      return new Promise((resolve, reject) => {
        oneActivityStepRequirement(params).then(res => {
          resolve(res)
        })
      })
    },
    oneStepRequirementTypeList(params) { // 当前环节的要求类型字典表
      return new Promise((resolve, reject) => {
        oneStepRequirementTypeList(params).then(res => {
          resolve(res)
        })
      })
    },
    insertStepRequirement(params) { // 新增要求
      return new Promise((resolve, reject) => {
        addStepRequirement(params).then(res => {
          resolve(res)
        })
      })
    },
    updateStepRequirement(params) { // 编辑要求
      return new Promise((resolve, reject) => {
        updateStepRequirement(params).then(res => {
          resolve(res)
        })
      })
    },
    deleteStepRequirement(params) { // 删除要求
      return new Promise((resolve, reject) => {
        deleteStepRequirement(params).then(res => {
          resolve(res)
        })
      })
    },
    insertActivityStep(params) {
      return new Promise((resolve, reject) => {
        insertActivityStep(params).then(res => {
          resolve(res)
        })
      })
    },
    updateActivityStep(params) {
      return new Promise((resolve, reject) => {
        updateActivityStep(params).then(res => {
          resolve(res)
        })
      })
    },
    deleteActivityStep(params) {
      return new Promise((resolve, reject) => {
        deleteActivityStep(params).then(res => {
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
    StepServerList(params) {
      return new Promise((resolve, reject) => {
        StepServerList(params).then(res => {
          resolve(res)
        })
      })
    },
    deleteStepServer(params) {
      return new Promise((resolve, reject) => {
        deleteStepServer(params).then(res => {
          resolve(res)
        })
      })
    },
    // 环节服务引入的模块
    fetchCourseInfo(params) {
      return new Promise((resolve, reject) => {
        fetchCourseInfo(params).then(res => {
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
    contentInfo(params) {
      return new Promise((resolve, reject) => {
        contentInfo(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
p {
  margin: 0;
}
.stageBox {
  display: flex;
  p {
    margin: 0;
  }
  .left {
    flex: 1;
    max-width: 200px;
    min-width: 200px;
    border-right: 1px solid #eee;
    // padding-left: 20px;
    .cell {
      padding-left: 15px;
      line-height: 40px;
      height: 40px;
      cursor: pointer;
    }
    .active {
      background-color: #ecf5ff;
    }
  }
  .right {
    flex: 9;
  }
}
</style>
