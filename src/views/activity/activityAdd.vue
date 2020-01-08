<template>
  <div class="container-fluid mt-3">
    <div class="container">
    <el-card shadow="never">
      <div class="activity">
        <el-button @click="backTo" size="medium" style="float: right">返 回</el-button>
        <div class="activity-theme">
          <p class="title">请选择活动主题</p>
          <div class="theme-list">
            <div class="content" ref="box">
              <ul class="ulList clearfix" ref="ulList" :style="ulStyle">
                <li v-for="(item, index) in themeList" @click="handleThemeChange(item, index)" :class="{'cell': true, 'active': select[index]}" :key="index">
                  <div class="pic">
                    <img src="../../../static/images/201709251425533546.png" alt="活动主题">
                  </div>
                  <p class="theme-name">{{item.themeName}}</p>
                </li>
              </ul>
            </div>
            <div class="leftArrow">
              <i class="el-icon-arrow-left" @click="leftArrow"></i>
            </div>
            <div class="rightArrow">
              <i class="el-icon-arrow-right" @click="rightArrow"></i>
            </div>
          </div>
        </div>
        <!-- 模板 -->
        <div class="template-list">
          <p class="title">请选择模板</p>
          <el-button :type="templateSelect[index]" v-for="(item, index) in templateList" @click="handleTemplateChange(item.value, item.label, index)" :key="index">{{item.label}}</el-button>
        </div>
        <!-- 模板具体的内容 -->
        <div class="info">
          <div class="top">
            <div class="title">{{currentTemplate}}</div>
            <el-button type="default" class="useTemplate" @click="applyTemplate">确定使用此模板</el-button>
            <el-button type="default" class="useTemplate" style="margin-right: 15px" @click="preview">预览</el-button>
          </div>
          <div class="step-list">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in stepList"
                :key="index">
                {{activity.stepName}}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </el-card>
    </div>
  </div>
</template>

<script>
import { fetchActivityTheme, fetchTemplatePage, getStageId, activityStepList } from '@/api/activity'
export default {
  data() {
    return {
      themeList: [],
      templateParams: {
        pageCurrent: 1,
        pageSize: 100,
        templateName: '',
        keyWords: '',
        themeCode: ''
      },
      templateList: [],
      stageId: '',
      stepList: [],
      templateId: null,
      ulLeft: 0,
      currentTemplate: '',
      select: [], // 当前选择的是哪一个主题
      templateSelect: []
    }
  },
  mounted() {
    this.getActivityTheme()
  },
  computed: {
    ulStyle() {
      return {
        left: this.ulLeft + 'px',
        width: (129 * this.themeList.length) + 'px'
      }
    }
  },
  methods: {
    getActivityTheme() { // 获取活动主题列表
      this.fetchActivityTheme().then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.themeList = res.data.result
          this.themeList.push({ themeCode: '', themeName: '自定义' })
          this.select = Array(this.themeList.length).fill(false)
        }
      })
    },
    getTemplateList() { // 获取主题下的模板列表
      this.fetchTemplatePage(this.templateParams).then(res => {
        if (res.data.code === 200) {
          if (!res.data.result || !res.data.result.records.length) {
            this.templateList = []
            this.$message.warning('此主题下没有模板')
            return
          }
          this.templateList = res.data.result.records.map(el => {
            return { value: el.id, label: el.templateName }
          })
          this.templateSelect = Array(this.templateList.length).fill('default')
        }
      })
    },
    getStageId(id) { // 获取阶段id
      return this.fetchStageId({ unionId: id }).then(res => {
        if (res.data.code === 200) {
          if (res.data.result[0]) {
            this.stageId = res.data.result[0].id
          } else {
            this.stageId = ''
          }
        }
      })
    },
    getActivityStepList() { // 阶段对应的环节list
      this.activityStepList({ stageId: this.stageId }).then(res => {
        if (res.data.code === 200) {
          this.stepList = res.data.result
        }
      })
    },
    handleThemeChange(item, index) {
      if (!item.themeCode) {
        this.$router.push({ name: 'activityInfo',
          params: { workshopId: this.$route.params.id }})
        return
      }
      this.select = Array(this.themeList.length).fill(false)
      this.select[index] = true
      this.templateParams.themeCode = item.themeCode
      this.getTemplateList()
    },
    async handleTemplateChange(id, label, index) {
      this.currentTemplate = label
      this.templateId = id
      this.templateSelect = Array(this.templateList.length).fill('default')
      this.templateSelect[index] = 'primary'
      await this.getStageId(id)
      this.getActivityStepList()
    },
    applyTemplate() { // 应用模板
      if (!this.templateId) {
        this.$message.warning('请先选择模板')
        return
      }
      this.$router.push({
        name: 'activityInfo', query: { templateId: this.templateId }})
    },
    preview() { // 预览
      if (!this.templateId) {
        this.$message.warning('请先选择模板')
        return
      }
      this.$router.push({
        name: 'activityInfo', query: { templateId: this.templateId, isPreview: true }})
    },
    rightArrow() {
      if (this.ulLeft <= -(129 * this.themeList.length - parseInt(this.$refs.box.getBoundingClientRect().width) - 100)) {
        this.ulLeft = -(129 * this.themeList.length - parseInt(this.$refs.box.getBoundingClientRect().width))
        return
      }
      this.ulLeft -= 100
    },
    leftArrow() {
      if (this.ulLeft >= -100) {
        this.ulLeft = 0
        return
      }
      this.ulLeft += 100
    },
    backTo() {
      this.$router.push({ name: 'activityList',
        params: { workshopId: this.$route.params.id }})
    },
    /* axios--- */
    fetchActivityTheme() { // 开启的活动模板
      return new Promise((resolve, reject) => {
        fetchActivityTheme().then(res => {
          resolve(res)
        })
      })
    },
    fetchTemplatePage(params) {
      return new Promise((resolve, reject) => {
        fetchTemplatePage(params).then(res => {
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
.activity {
  p {
    margin: 0;
  }
  ul {
    padding: 0;
  }
  .activity-theme {
    .title {
      font-size: 20px;
      color: #333;
      margin-bottom: 20px;
    }
    .theme-list {
      position: relative;
      .content{
        margin: 0 70px;
        // padding: 0 20px;
        position: relative;
        height: 190px;
        overflow: hidden;
        // width: 1055px;
        .ulList {
          list-style: none;
          position: absolute;
          transition: 0.35s;
          // left: 0;
          top: 0;
          height: 170px;
          .cell {
            height: 165px;
            width: 120px;
            border: solid 1px #e2e4e9;
            float: left;
            margin-right: 9px;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            &:hover {
              border: solid 1px #409EFF;
            }
            .pic {
              width: 88px;
              height: 88px;
              border-radius: 50%;
              border: solid 1px #e5e7ec;
              margin: 0 auto;
              margin-top: 20px;
              text-align: center;
              img {
                margin-top: 17px;
                margin-left: 2px;
              }
            }
            .theme-name {
              font-size: 18px;
              // color: #7d8c9b;
              padding-top: 15px
            }
          }
          .active {
            border: solid 1px #409EFF;
            color: #409EFF;
          }
        }
      }
      .leftArrow {
        font-size: 40px;
        cursor: pointer;
        color: #ccc;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
      .rightArrow {
        font-size: 40px;
        color: #ccc;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .template-list {
    margin-top: 20px;
    .title {
      font-size: 20px;
      color: #333;
      margin-bottom: 20px;
    }
  }
  .info {
    border: solid 1px #e3e5eb;
    margin: 50px 0px 20px;
    padding: 23px 25px;
    .top {
      height: 40px;
      line-height: 40px;
      .title {
        float: left;
        font-size: 18px;
      }
      .useTemplate {
        float: right;
      }
    }
    .step-list {
      margin-top: 20px;
    }
  }
  .clearfix {
    &::after {
      content: '';
      clear: both;
      height: 0;
      visibility: hidden;
    }
  }
}
</style>
