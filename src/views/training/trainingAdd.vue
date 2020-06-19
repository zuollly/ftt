<template>
  <div class="">
    <el-card shadow="never">
      <div class="apply-template">
        <!-- <div class="left">
          <p class="title"><i class="el-icon-notebook-2"></i>活动信息</p>
          <p :class="{'base-title': true, 'active': selectedStep[0]}" @click="baseInfo">基本信息</p>
        </div> -->
        <div class="right">
          <activity-base-info @stageId='saveStageId' v-if="baseInfoShow" @activityId='saveActivityId' :stepInfo='currentStepInfo' :activityId='activityId'></activity-base-info>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getStageId, activityStepList, fetchActivityInfo } from '@/api/activityCopy'
export default {
  components: {
    activityBaseInfo: () => import('./modules/activityBaseInfo.vue')
  },
  data() {
    return {
      form: {},
      stageId: '',
      currentStepInfo: {},
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
    },
    isPreview() { // 是不是预览
      return !!this.$route.query.isPreview
    }
  },
  created() {
    // if (this.hasApplyTemplate) {
    //   this.getStageId({ unionId: this.$route.query.templateId }).then(() => {
    //     this.getActivityStepList().then(() => {
    //     })
    //   })
    // }
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
    // getActivityInfo() {
    //   this.fetchActivityInfo({ id: this.activityId }).then(res => {
    //     if (res.data.code === 200) {
    //       this.activityByTemplate = res.data.result.templateId
    //     }
    //   })
    // },
    getStageId(params) { // 根据活动id或者模板id换取阶段id
      return this.fetchStageId(params).then(res => {
        console.log(res, 'res---------33')
        if (res.data.code === 200) {
          this.stageId = res.data.result[0].id
        }
      })
    },
    getActivityStepList() { // 环节list
      return this.activityStepList({ stageId: this.stageId }).then(res => {
        if (res.data.code === 200) {
          this.currentStepInfo = res.data.result[0]
        }
      })
    },
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
    // margin-left: 250px;
  }
}
</style>
