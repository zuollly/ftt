<template>
  <div class="">
    <el-card shadow="never">
      <div class="apply-template">
        <!-- <div class="left">
          <p class="title"><i class="el-icon-notebook-2"></i>活动信息</p>
          <p :class="{'base-title': true, 'active': selectedStep[0]}" @click="baseInfo">基本信息</p>
        </div> -->
        <div class="right">
          <activity-base-info @stageId='saveStageId' v-if="baseInfoShow" @activityId='saveActivityId' :stepTlist='stepList' :activityId='activityId'></activity-base-info>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getStageId, activityStepList } from '@/api/activityCopy'
export default {
  components: {
    activityBaseInfo: () => import('./modules/activityBaseInfo.vue')
  },
  data() {
    return {
      form: {},
      stageId: '',
      stepList: [],
      baseInfoShow: true,
      activityId: '',
      addStepShow: false,
      activityByTemplate: true // 活动已经创建了, 创建的时候有没有用模板
    }
  },
  computed: {
    hasApplyTemplate() { // 应用模板了
      return !!this.$route.query.templateId
    },
    isEditActivity() { // 是不是编辑活动
      return !!this.$route.query.activityId
    }
  },
  created() {
    if (this.isEditActivity) {
      this.activityId = this.$route.query.activityId
      this.getStageId({ unionId: this.activityId }).then(() => {
        this.getActivityStepList().then(() => {
        })
      })
      // this.getActivityInfo()
    }
  },
  methods: {
    getStageId(params) { // 根据活动id或者模板id换取阶段id
      return this.fetchStageId(params).then(res => {
        console.log(res, 'res---------33')
        if (res.data.code === 200) {
          this.stageId = res.data.result[0].id
        }
      })
    },
    getActivityStepList() { // 获取环节list
      return this.activityStepList({ stageId: this.stageId }).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.result, 'res.datares.data-res.data')
          this.stepList = res.data.result
        }
      })
    },
    // 应用模板后拿到阶段id
    saveStageId(value) {
      this.stageId = value
      console.log(value, '==============')
      this.getActivityStepList()
      // this.getActivityInfo()
    },
    saveActivityId(value) {
      this.activityId = value
    },
    baseInfo() {
      this.baseInfoShow = true
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
    .title {
      font-size: 16px;
      color: #999;
      i {
        color: #409eff;
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
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .active {
      background-color: rgb(178, 216, 255);
      border-radius: 4px;
    }
  }
  .right {
    // margin-left: 250px;
  }
}
</style>
