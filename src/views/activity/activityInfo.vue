<template>
  <div class="container-fluid mt-3">
    <div class="container">
    <el-card shadow="never">
      <div class="apply-template">
        <div class="left">
          <p class="title"><i class="el-icon-notebook-2"></i>活动信息</p>
          <p :class="{'base-title': true, 'active': selectedStep[0]}" @click="baseInfo">基本信息</p>
          <p class="title"><i class="el-icon-notebook-1"></i>活动内容</p>
          <div>
            <p :class="{'step-name': true, 'active': selectedStep[index+1]}" v-for="(item, index) in stepList" @click="handleStepChange(item.id,index)" :key="index">{{item.stepName}}</p>
          </div>
          <p class="add-step">
            <el-button type="primary" style="margin-top: 20px; width: 100%" size="mini" v-if="activityId && notApplyTemplate && !activityByTemplate" @click="openAddStep">添加环节</el-button>
          </p>
        </div>
        <div class="right">
          <activity-base-info @stageId='saveStageId' v-if="baseInfoShow" @activityId='saveActivityId' :activityId='activityId'></activity-base-info>
          <activity-step @updateStep='getActivityStepList' :activityId='activityId' :stageId='stageId' :stepId='currentStepId' v-else></activity-step>
        </div>
      </div>
    </el-card>
    <!--  -->
    <add-step v-if="addStepShow" :stepNumber='stepList.length' @addStepSuccess='closeAddStep' :stageId='stageId'></add-step>
  </div>
  </div>
</template>

<script>
import { getStageId, activityStepList, fetchActivityInfo } from '@/api/activityCopy'
export default {
  components: {
    activityBaseInfo: () => import('./components/activityBaseInfo.vue'),
    activityStep: () => import('./components/activityStep.vue'),
    addStep: () => import('./components/addStep.vue')
  },
  data() {
    return {
      form: {},
      stepList: [],
      stageId: '',
      currentStepId: '',
      baseInfoShow: true,
      activityId: '',
      addStepShow: false,
      selectedStep: [true],
      activityByTemplate: true // 活动已经创建了, 创建的时候有没有用模板
    }
  },
  computed: {
    notApplyTemplate() { // 有没有应用模板
      return !this.$route.query.templateId
    },
    isEditActivity() { // 是不是编辑活动
      return !!this.$route.query.activityId
    },
    isPreview() { // 是不是预览
      return !!this.$route.query.isPreview
    }
  },
  created() {
    if (!this.notApplyTemplate) {
      this.getStageId({ unionId: this.$route.query.templateId }).then(() => {
        this.getActivityStepList().then(() => {
          this.selectedStep = Array(this.stepList.length + 1).fill(false)
          this.selectedStep[0] = true
        })
      })
    }
    if (this.isEditActivity) {
      this.activityId = this.$route.query.activityId
      this.getStageId({ unionId: this.activityId }).then(() => {
        this.getActivityStepList().then(() => {
          this.selectedStep = Array(this.stepList.length + 1).fill(false)
          this.selectedStep[0] = true
          this.currentStepId = this.stepList[0].id
        })
      })
      this.getActivityInfo()
    }
  },
  methods: {
    getActivityInfo() {
      this.fetchActivityInfo({ id: this.activityId }).then(res => {
        if (res.data.code === 200) {
          this.activityByTemplate = res.data.result.templateId
        }
      })
    },
    getStageId(params) { // 根据活动id或者模板id换取阶段id
      return this.fetchStageId(params).then(res => {
        if (res.data.code === 200) {
          this.stageId = res.data.result[0].id
        }
      })
    },
    getActivityStepList() { // 环节list
      return this.activityStepList({ stageId: this.stageId }).then(res => {
        console.log(res, 'stepList')
        if (res.data.code === 200) {
          this.stepList = res.data.result
        }
      })
    },
    saveStageId(value) {
      this.stageId = value
      console.log('==============')
      this.getActivityStepList()
      this.getActivityInfo()
    },
    saveActivityId(value) {
      this.activityId = value
    },
    handleStepChange(id, index) {
      this.baseInfoShow = false
      this.currentStepId = id
      this.selectedStep = Array(this.stepList.length + 1).fill(false)
      this.selectedStep[index + 1] = true
    },
    baseInfo() {
      this.baseInfoShow = true
      this.selectedStep = Array(this.stepList.length + 1).fill(false)
      this.selectedStep[0] = true
    },
    openAddStep() {
      this.addStepShow = true
    },
    closeAddStep() {
      this.addStepShow = false
      this.getActivityStepList()
    },
    /* axios----- */
    fetchStageId(params) {
      return new Promise((resolve, reject) => {
        getStageId(params).then(res => {
          resolve(res)
        })
      })
    },
    activityStepList(params) {
      return new Promise((resolve, reject) => {
        activityStepList(params).then(res => {
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
    }
  }
}
</script>

<style scoped lang="scss">
.apply-template {
  p {
    margin: 0;
  }
  .left {
    width: 224px;
    float: left;
    border: 1px solid #eee;
    padding: 10px;
    padding-bottom: 60px;
    min-height: 300px;
    position: relative;
    .add-step {
      width: calc(100% - 20px);
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
    .title {
      font-size: 16px;
      color: #999;
      i {
        color: #409EFF;
        margin-right: 5px;
      }
    }
    .base-title {
      padding-left: 20px;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    .step-name {
      padding-left: 20px;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .active {
      background-color: rgb(178, 216, 255);
      border-radius: 4px;
    }
  }
  .right {
    margin-left: 250px;
  }
}
</style>
