<template>
<div class="">
  <div class="activityWrapper">
    <el-row v-if="hasHistory">
      <el-col>
        <BackSuperior></BackSuperior>
      </el-col>
    </el-row>
    <el-row  class="contentWrapper" :gutter="15">
      <el-col class="train-left" :span="6">
        <ul class="ulWrapper">
          <li>
            <span class="list-1">活动信息</span>
            <ul>
              <li style="color: white; cursor: pointer" class="zh-bg-color-green active" @click="getBasicMessage">
                基本信息
              </li>
            </ul>
          </li>
          <li>
            <span class="list-2">活动内容</span>
            <ul class="ul-list2">
              <li class="clearfix" :class="{'liActive': item.choose}" v-for="(item, index) in stepList" :key="index" @click="getActivityContent(item, index)">
                {{item.stepName}}
              </li>
            </ul>
          </li>
        </ul>
      </el-col>
      <el-col class="train-right" :span="14">
        <div class="divWrapper">
          <component :currentStep.sync='currentStep' :is="activityComponent" :holderInfo="holder"></component>
        </div>
      </el-col>
      <el-col class="train-member" :span="4">
        <div class="activity-member">
          <div class="titles">
            <span>活动成员</span>
            <!-- <router-link class="more Right a-green" tag="a" :to="{ name: 'activity-member', query: { activityId: $route.params.activityId } }">
              更多&gt;
            </router-link> -->
          </div>
          <div class="member-contents">
            <ul>
              <li v-for="(item, index) in memberList" :key="index">
                <a>
                  <img :src="item.userInfo.avatar">
                  <p :title="item.userInfo.realname">
                    {{item.userInfo.realname}}
                  </p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import { getStageId, activityStepList, fetchActivityHolder } from '@/api/activityCopy.js'
import { fetchActivityMember } from '@/api/member.js'
export default {
  components: {
    BasicMessage: () => import('./components/BasicMessage.vue'),
    activityContent: () => import('./components/activityContent.vue'),
    BackSuperior: () => import('@/components/BackSuperior')
  },
  data() {
    return {
      stageId: '',
      stepList: [],
      contentType: '',
      activityComponent: 'BasicMessage',
      currentStep: {},
      classListData: [
        { className: 'jkkk1', choose: false },
        { className: 'jkkk2', choose: false },
        { className: 'jkkk3', choose: false },
        { className: 'jkkk4', choose: false }
      ],
      holder: {},
      memberList: []
    }
  },
  computed: {
    hasHistory() {
      return window.history.length > 1
    }
  },
  watch: {
    contentType: function(val) {
      if (val === 'basic') {
        this.activityComponent = 'BasicMessage'
      } else {
        this.activityComponent = 'activityContent'
      }
    }
  },
  methods: {
    getActivityMember() {
      const activityId = this.$route.params.activityId
      this.fetchActivityMember({ category: 1, categoryId: activityId }).then(res => {
        const memberList = res.data.result.records
        if (res.data.code === 200) {
          this.memberList = memberList
        }
      })
    },
    queryStage() {
      const activityId = this.$route.params.activityId
      console.log(this.$route.params, activityId, '000000000000000')
      this.fetchStageId({ unionId: activityId }).then(res => {
        if (res.data.code === 200) {
          this.stageId = res.data.result[0].id
          this.getActivityStepList()
        }
      })
    },
    getActivityStepList() { // 环节list
      return this.activityStepList({ stageId: this.stageId }).then(res => {
        if (res.data.code === 200) {
          res.data.result.forEach(element => {
            element.choose = false
          })
          this.stepList = res.data.result
        }
      })
    },
    getBasicMessage() {
      this.contentType = 'basic'
    },
    getActivityContent(item, index) {
      console.log(item, '99')
      this.currentStep = item
      this.contentType = 'content'
      this.stepList.forEach(item => {
        item.choose = false
      })
      item.choose = true
    },
    getActivityHolder() {
      const activityId = this.$route.params.activityId
      fetchActivityHolder({ roleCode: 'ACT_HOST', activityId: activityId }).then(res => {
        if (res.data.code === 200 && res.data.result && res.data.result.userInfo) {
          this.holder = res.data.result.userInfo
        }
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
    },
    fetchActivityMember(params) { // 获取活动成员
      return new Promise((resolve, reject) => {
        fetchActivityMember(params).then(res => {
          resolve(res)
        })
      })
    }
  },
  mounted() {
    this.queryStage()
    this.getActivityHolder()
    this.getActivityMember()
  }
}
</script>

<style lang="scss" scoped>
.activityWrapper{
  ul, li{
    list-style: none;
  }
  a{
    text-decoration: none;
  }
 .contentWrapper{
    .train-left{
      border-right: solid 1px #ededed;
      box-sizing: border-box;

      padding-bottom: 100px;
      // margin-right: 10px;
      // max-width: 250px;
      .ulWrapper {
        padding: 0px 10px;
        background: #ffffff;
        min-height: 600px;
        li{
          font-size: 16px;
          color: #96a3af;
          padding: 6px 0 6px 10px;
          border-radius: 5px;
        }
        .zh-bg-color-green {
          background: #00cbac !important;
        }
        .liActive{
          background-color: #e7edf6;
        }
      }
      .clearfix:hover {
        background-color: #e7edf6;
        cursor: pointer;
      }
    }
    .train-right{
      // border: solid 1px #dbdbdb;
      // box-sizing: border-box;
      padding-bottom: 20px;
      // min-height: 600px;
      overflow-y: auto;
      border-right: solid 1px #ededed;
      box-sizing: border-box;
      .divWrapper{
        background-color: #ffffff;
        min-height: 600px;
      }
    }
    .train-member{
      // background: #ffffff;
      // border: solid 1px #dbdbdb;
      // box-sizing: border-box;
      padding-bottom: 20px;
      overflow-y: auto;
      .activity-member{
        overflow-y: auto;
        background: #ffffff;
        min-height: 600px;
        .titles {
          background: #f3faff;
          height: 34px;
          line-height: 34px;
          border-radius: 5px;
          font-size: 16px;
          span {
            background: url(../../../static/images/icon4.png) no-repeat left center;
            padding-left: 15px;
            margin-left: 15px;
          }
          a{
            margin-right: 15px;
            float: right;
            font-size: 14px;
            color: #00cbac !important;
          }
        }
        .member-contents{
          height: auto;
          overflow: hidden;
          ul{
            overflow: hidden;
            padding: 10px 18px;
            li {
              float: left;
              // margin-left: 53px;
              // padding-left: 20px;
              text-align: center;
              margin-top: 15px;
              a{
                color: #34495e;
                img {
                    border: solid 1px #e8ebef;
                    border-radius: 50%;
                    width: 68px;
                    height: 68px;
                }
              }
            }
            li:nth-child(2n+1){
              margin-right: 10px;
            }
          }
        }
      }
    }
    .step-name {
      padding-left: 20px;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .active {
      background-color: rgb(178, 216, 255);
      border-radius: 4px;
    }
  }
  .active {
    background: #ccf3ed;
    border-radius: 5px;
  }
}
</style>
