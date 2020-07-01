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
                <span>{{form.activityManagerName||'未指定'}}</span>
              </el-form-item>
              <!-- <el-form-item label="活动创建人：">
                <span>{{form.creatorName}}</span>
              </el-form-item> -->
              <el-form-item label="活动时间：">
                <span v-if="form.startTime">{{(form.startTime).split(' ')[0]}} 至 {{(form.endTime).split(' ')[0]}}</span>
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
      <div class="activity-desc">
        <div class="titles"><span>成员管理</span></div>
        <div class="activity-member">
          <div class="label">
            <span>当前邀请人：{{memberTotal}}人</span>
          </div>
          <div class="member-contents">
            <el-table :data="memberList" style="width: 100%">
              <el-table-column prop="userInfo.realname" width="150" label="姓名"></el-table-column>
              <el-table-column prop="date" label="操作">
                <template slot-scope="scope">
                  <div class="button">
                    <el-button type="success" plain size="mini" @click="cancelInvite(scope.row)">取消邀请</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="activity-member">
          <div class="label">
            <span>当前报名人员：{{memberApplyTotal}}人</span>
          </div>
          <div v-if="memberApplyList.length">
            <el-button type="success" plain size="mini" @click="passApply('batch')">通过</el-button>
            <el-button type="warning" plain size="mini" @click="refuteApply('batch')">拒绝</el-button>
          </div>
          <div class="member-contents">
            <el-table :data="memberApplyList" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
              <el-table-column prop="userInfo.realname" width="150" label="姓名"></el-table-column>
              <el-table-column prop="date" label="操作">
                <template slot-scope="scope">
                  <div class="button">
                    <el-button type="success" plain size="mini" @click="passApply('one',scope.row)">通过</el-button>
                    <el-button type="warning" plain size="mini" @click="refuteApply('one',scope.row)">拒绝</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchActivityInfo, fetchActivityThemePage, fetchActivityStatus, fetchActivityHolder } from '@/api/activityCopy.js'
import { deteleJyUserPage, verifyJyUserPage } from '@/api/train.js'
import { fetchActivityMember } from '@/api/member.js'
import { transRichImg } from '@/utils/filters'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {},
      themeObj: {},
      imageUrl: '',
      memberList: [],
      memberTotal: 0,
      memberApplyList: [],
      memberApplyTotal: 0,
      statusInfo: {},
      selectStudyphase: [],
      studyphaseToSubject: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'uuid'
    ])
  },
  methods: {
    transRichImg,
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    cancelInvite(item) {
      this.$confirm('确定要取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [item.id]
        deteleJyUserPage(params).then((res) => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message.success('取消成功')
            this.getActivityMemberList()
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    refuteApply(type, item) {
      let applyUserIds = []
      if (type === 'one') {
        applyUserIds = [item.id]
      } else if (type === 'batch') {
        if (!this.multipleSelection.length) {
          this.$message.warning('请先选择一条数据')
          return
        }
        applyUserIds = this.multipleSelection.map(item => {
          return item.id
        })
      }
      this.$confirm('确定要拒绝?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          actId: this.$route.params.activityId,
          operateId: this.uuid,
          result: 2,
          ids: applyUserIds
        }
        verifyJyUserPage(params).then((res) => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getActivityApplyMember()
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    passApply(type, item) {
      let applyUserIds = []
      if (type === 'one') {
        applyUserIds = [item.id]
      } else if (type === 'batch') {
        if (!this.multipleSelection.length) {
          this.$message.warning('请先选择一条数据')
          return
        }
        applyUserIds = this.multipleSelection.map(item => {
          return item.id
        })
      }
      this.$confirm('确定通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          actId: this.$route.params.activityId,
          operateId: this.uuid,
          result: 1,
          ids: applyUserIds
        }
        verifyJyUserPage(params).then((res) => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getActivityApplyMember()
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    getActivityInfo() {
      const activityId = this.$route.params.activityId
      console.log(activityId, 'activityId')
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
    getActivityMemberList() {
      const activityId = this.$route.params.activityId
      this.fetchActivityMember({ category: 1, categoryId: activityId, joinType: 0 }).then(res => {
        const memberList = res.data.result.records
        if (res.data.code === 200) {
          this.memberList = memberList
          this.memberTotal = res.data.result ? res.data.result.total : 0
        }
      })
    },
    getActivityApplyMember() {
      const activityId = this.$route.params.activityId
      this.fetchActivityMember({ category: 1, categoryId: activityId, joinType: 1 }).then(res => {
        const memberList = res.data.result ? res.data.result.records : []
        if (res.data.code === 200) {
          this.memberApplyList = memberList
          this.memberApplyTotal = res.data.result ? res.data.result.total : 0
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
    this.getActivityMemberList()
    this.getActivityApplyMember()
    this.queryActivityStatus()
    // this.getActivityHolder()
  }
}
</script>

<style lang="scss" scoped>
.basicContent {
  ul,
  li {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
  .side-1 {
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
        img {
          width: 200px;
          height: 200px;
          margin-bottom: 19px;
        }
      }
      .basic-content-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .Left {
        width: 20%;
      }
      .Right {
        width: 75%;
        /deep/ .el-form-item {
          margin-bottom: 5px;
        }
      }
    }
    .activity-desc {
      .titles {
        background: #f3faff;
        height: 34px;
        line-height: 34px;
        border-radius: 5px;
        font-size: 16px;
        span {
          background: url(../../../../static/images/icon4.png) no-repeat left
            center;
          padding-left: 15px;
          margin-left: 15px;
        }
      }
      .descript-contents {
        padding: 0px 20px 0px;
      }
    }
    .activity-member {
      margin-bottom: 20px;
      .label {
        padding: 10px;
      }
      .titles {
        background: #f3faff;
        height: 34px;
        line-height: 34px;
        border-radius: 5px;
        font-size: 16px;
        span {
          background: url(../../../../static/images/icon4.png) no-repeat left
            center;
          padding-left: 15px;
          margin-left: 15px;
        }
        a {
          margin-right: 15px;
          float: right;
          font-size: 14px;
          color: #00cbac !important;
        }
      }
      .member-contents {
        height: auto;
        overflow: hidden;
        ul {
          li {
            float: left;
            margin-left: 53px;
            text-align: center;
            margin-top: 15px;
            a {
              color: #34495e;
              img {
                border: solid 1px #e8ebef;
                border-radius: 50%;
                width: 68px;
                height: 68px;
              }
            }
          }
        }
      }
    }
    .activitys-descript {
      .titles {
        background: #f3faff;
        height: 34px;
        line-height: 34px;
        border-radius: 5px;
        font-size: 16px;
        span {
          background: url(../../../../static/images/icon4.png) no-repeat left
            center;
          padding-left: 15px;
          margin-left: 15px;
        }
      }
      .activity-statistic {
        ul {
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

