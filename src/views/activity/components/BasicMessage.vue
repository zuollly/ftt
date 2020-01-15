<template>
  <div class="basicContent">
    <div class="side-1">
      <div class="title">
        <span>基本信息</span>
        <div class="bd-t"></div>
      </div>
      <div class="edit-infor">
        <div class="basic-content-wrapper">
          <div class="change-img Left" style="height: auto;">
            <img :src="imageUrl || 'https://activitycdn.ourteacher.com.cn/Content/NewtrainingactivityImg/img11.jpg'" width="203" height="203">
          </div>
          <!--Right-->
          <div class="change-infor Right">
            <el-form label-width="180px">
              <el-form-item label="活动名称：">
                <span>{{form.activityName}}</span>
              </el-form-item>
              <el-form-item label="活动主题：">
                <span>{{themeObj.themeName||form.activityThemeName}}</span>
              </el-form-item>
              <el-form-item label="活动主持人：">
                <span>{{holderInfo.realname||'未指定'}}</span>
              </el-form-item>
              <el-form-item label="活动时间：">
                <span v-if="form.startTime">{{(form.startTime).split(' ')[0]}} 至 {{(form.endTime).split(' ')[0]}}</span>
              </el-form-item>
              <!-- <el-form-item label="学段学科：">
                <p style="margin: 0" v-if="studyphaseToSubject.length">{{studyphaseToSubject.join(' 、')}}</p>
              </el-form-item> -->
              <el-form-item label="活动关键词：">
                <span>{{form.activityKeyword}}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="activity-desc">
        <div class="titles"><span>活动描述</span></div>
        <div class="descript-contents mt-15">
          <p v-html="transRichImg(form.activityDescription)"></p>
        </div>
      </div>
      <div class="activitys-descript">
        <div class="titles"><span>活动统计</span></div>
        <div class="activity-statistic">
          <ul>
            <li>
              <div class="statistic-show">
                <img src="https://activitycdn.ourteacher.com.cn/Content/NewtrainingactivityImg/icon6.png" width="53" height="53">
                <div>
                  <span>成员数</span>
                  <span class="number">{{statusInfo.memberCount}}</span>
                </div>
              </div>
            </li>
            <li>
              <div class="statistic-show">
                <img src="https://activitycdn.ourteacher.com.cn/Content/NewtrainingactivityImg/icon8.png" width="53" height="53">
                <div>
                  <span>活动成果数量</span>
                  <span class="number">{{statusInfo.resourceCount}}</span>
                </div>
              </div>
            </li>
            <li>
              <div class="statistic-show">
                <img src="https://activitycdn.ourteacher.com.cn/Content/NewtrainingactivityImg/icon7.png" width="53" height="53">
                <div>
                  <span>活动参与数量</span>
                  <span class="number">{{statusInfo.joinCount}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchActivityInfo, fetchActivityThemePage, fetchActivityStatus, fetchActivityHolder } from '@/api/activityCopy.js'
import { fetchActivityMember } from '@/api/member.js'
import { transRichImg } from '@/utils/filters'
export default {
  data() {
    return {
      form: {},
      themeObj: {},
      imageUrl: '',
      memberList: [],
      statusInfo: {},
      selectStudyphase: [],
      studyphaseToSubject: []
    }
  },
  props: {
    holderInfo: {
      type: Object
    }
  },
  methods: {
    transRichImg,
    getActivityInfo() {
      const activityId = this.$route.params.activityId
      this.fetchActivityInfo({ id: activityId }).then(res => {
        const currentActivityInfo = res.data.result
        if (res.data.code === 200) {
          this.form = currentActivityInfo
          this.imageUrl = currentActivityInfo.activityImg
          this.selectStudyphase = []
          // this.studyphaseToSubject = this.form.segSubVOs.map(el => {
          //   this.selectStudyphase.push(el.segsubId)
          //   return el.segName + ' - ' + el.subName
          // })
          this.queryActivityThemePage(currentActivityInfo.activityThemeCode)
        }
      })
    },
    queryActivityStatus() {
      const activityId = this.$route.params.activityId
      this.fetchActivityStatus({ id: activityId }).then(res => {
        const statusInfo = res.data.result
        if (res.data.code === 200) {
          this.statusInfo = statusInfo
        }
      })
    },
    getActivityMember() {
      const activityId = this.$route.params.activityId
      this.fetchActivityMember({ category: 1, categoryId: activityId }).then(res => {
        const memberList = res.data.result.records
        if (res.data.code === 200) {
          this.memberList = memberList
        }
      })
    },
    getActivityHolder() {
      const activityId = this.$route.params.activityId
      fetchActivityHolder({ roleCode: 'ACT_HOST', activityId: activityId }).then(res => {
        if (res.data.code === 200) {
          this.holder = res.data.result || {}
        }
      })
    },
    queryActivityThemePage(code) {
      fetchActivityThemePage({}).then(res => {
        if (res.data.code === 200) {
          this.themeObj = res.data.result.records.find((value, index, arr) => {
            return value.themeCode === code
          })
        }
      })
    },
    fetchActivityInfo(params) { // 获取活动详情
      return new Promise((resolve, reject) => {
        fetchActivityInfo(params).then(res => {
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
    },
    fetchActivityStatus(params) {
      return new Promise((resolve, reject) => {
        fetchActivityStatus(params).then(res => {
          resolve(res)
        })
      })
    }
  },
  mounted() {
    this.getActivityInfo()
    this.getActivityMember()
    this.queryActivityStatus()
    console.log('xxcxcxcx', this.holderInfo)
    // this.getActivityHolder()
  }
}
</script>

<style lang="scss" scoped>
.basicContent{
  ul, li{
    list-style: none;
  }
  a{
    text-decoration: none;
  }
  .side-1{
    padding: 30px 20px;
    .title {
      border-bottom: solid 1px #e3e5eb;
      color: #4e5863;
      font-size: 18px;
      position: relative;
      .bd-t {
        border: solid 2px #41b1ff;
        box-sizing: border-box;
        margin-top: 15px;
        width: 80px;
      }
    }
    .edit-infor {
      margin-top: 25px;
      .change-img {
        padding: 13px 11px;
        border-radius: 5px;
        img{
          width: 200px;
          height: 200px;
          margin-bottom: 19px;
        }
      }
      .basic-content-wrapper{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .Left{
        width: 20%;
      }
      .Right {
        width: 75%;
        /deep/ .el-form-item{
          margin-bottom: 5px;
        }
      }
    }
    .activity-desc{
      .titles {
        background: #f3faff;
        height: 34px;
        line-height: 34px;
        border-radius: 5px;
        font-size: 16px;
        span {
          background: url(../../../../static/images/icon4.png) no-repeat left center;
          padding-left: 15px;
          margin-left: 15px;
        }
      }
      .descript-contents{
        padding: 0px 20px 0px;
      }
    }
    // .activity-member{
    //   .titles {
    //     background: #f3faff;
    //     height: 34px;
    //     line-height: 34px;
    //     border-radius: 5px;
    //     font-size: 16px;
    //     span {
    //       background: url(../../../../static/image/icon4.png) no-repeat left center;
    //       padding-left: 15px;
    //       margin-left: 15px;
    //     }
    //     a{
    //       margin-right: 15px;
    //       float: right;
    //       font-size: 14px;
    //       color: #00cbac !important;
    //     }
    //   }
    //   .member-contents{
    //     height: auto;
    //     overflow: hidden;
    //     ul{
    //       li {
    //         float: left;
    //         margin-left: 53px;
    //         text-align: center;
    //         margin-top: 15px;
    //         a{
    //           color: #34495e;
    //           img {
    //               border: solid 1px #e8ebef;
    //               border-radius: 50%;
    //               width: 68px;
    //               height: 68px;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    .activitys-descript{
      .titles {
        background: #f3faff;
        height: 34px;
        line-height: 34px;
        border-radius: 5px;
        font-size: 16px;
        span {
          background: url(../../../../static/images/icon4.png) no-repeat left center;
          padding-left: 15px;
          margin-left: 15px;
        }
      }
      .activity-statistic{
        ul{
          li {
            background: #f0fafc;
            float: left;
            margin-right: 17px;
            height: 84px;
            .statistic-show {
              padding: 14px 15px;
              img {
                float: left;
                margin-top: 3px;
              }
              div {
                padding-left: 65px;
                span {
                  display: block;
                  color: #80a2c2;
                }
                .number {
                  font-size: 26px;
                  color: #6789a8;
                  padding-top: 3px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

