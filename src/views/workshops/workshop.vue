<template>
  <el-row class="workshop-homeMain-moduel" :gutter="10">
    <el-col class="home-details" :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
      <div class="informationWrapper d-flex main-border bg-white mb-2 border-shadow">
        <div class="swiperWrapper">
          <img src="../../../static/images/swiper.jpg" alt="">
        </div>
        <div class="informationContent contentWrapper flex-grow-1">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="公告" name="first">
              <WorkShopNotice :page="'home'" :homeNoticeList='homeNoticeList'></WorkShopNotice>
            </el-tab-pane>
            <el-tab-pane label="资讯" name="second">
              <WorkshopInformation :page="'home'" :informationList='informationList'></WorkshopInformation>
            </el-tab-pane>
          </el-tabs>
          <el-button class="moreBtn" @click="getMore(activeName)" size="middle" type="text">查看更多</el-button>
        </div>
      </div>
      <div class="informationWrapper main-border bg-white mb-2 border-shadow">
        <div class="headWrapper">
          <p class="p">名师讲堂</p>
          <el-button type="text">查看更多</el-button>
        </div>
        <div>名师讲堂</div>
      </div>
      <div class="informationWrapper main-border bg-white mb-2 border-shadow">
        <div class="headWrapper">
          <p class="p">工作室活动</p>
          <el-button type="text">查看更多</el-button>
        </div>
        <workshopActivityList :page="'home'" :homeActivityList='workshopActivityList'></workshopActivityList>
      </div>
      <div class="informationWrapper main-border bg-white mb-2 border-shadow">
        <div class="headWrapper">
          <p class="p">成果展示</p>
          <el-button type="text">查看更多</el-button>
        </div>
        <WorkShopAchievementList :homeAchievementList='homeAchievementList' :page="'home'"></WorkShopAchievementList>
      </div>
    </el-col>
    <el-col class="home-details" :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
      <div class="informationWrapper personal-details radius-border bg-white mb-2 border-shadow">
        <div class="personal-banner radius-border">
          <img class="personal-img radius-border" src="../../../static/images/avatarTop.jpg" alt="">
        </div>
        <div class="personal-avatars-wrapper">
          <div class="personal-avatars">
            <div class="logo">
              <img v-if="workshopInfo.groupLogo" :src="workshopInfo.groupLogo" alt="">
              <img v-if="!workshopInfo.groupLogo" src="http://api.yx.nercel.cn/file/avator/default_avator.jpg" alt="">
            </div>
            <p class="name label">{{workshopInfo.adminUserName}}</p>
            <!-- <p class="subject label">初中数学</p> -->
          </div>
        </div>
        <div class="personal-statics">
          <div class="statics-label statics-line">
            <p class="num">{{workshopBehaviour.memberCount}}</p>
            <p class="type">成员</p>
          </div>
          <div class="statics-label statics-line">
            <p class="num">{{workshopBehaviour.actCount}}</p>
            <p class="type">活动</p>
          </div>
          <div class="statics-label">
            <p class="num">{{workshopBehaviour.resourceCount}}</p>
            <p class="type">教学资源</p>
          </div>
        </div>
        <div class="personal-button">
          <el-button type="warning" @click="getApplyIntoWorkshop">申请加入工作室</el-button>
        </div>

      </div>
      <div class="staticInfoWrapper main-border bg-white mb-2 border-shadow">
        <div class="headWrapper">
          <p class="p">工作室活跃度</p>
          <!-- <el-button type="text">查看更多</el-button> -->
        </div>
        <div class="staticsWrapper">
          <div class="totalLinessW">
            <p class="p">活跃度：<span>{{workshopBehaviour.totalLiness}}</span></p>
            <img src="../../../static/images/statics.png" alt="">
          </div>
          <p class="p loginCountW">访问量：<span>{{workshopBehaviour.loginCount}}</span></p>

        </div>
      </div>
      <div class="informationWrapper main-border bg-white mb-2 border-shadow">
        <div class="headWrapper">
          <p class="p">工作坊资源</p>
          <!-- <el-button type="text">查看更多</el-button> -->
        </div>
        <WorkShopResourceList :homeResourceList='homeResourceList' :page="'home'"></WorkShopResourceList>
      </div>
      <div class="informationWrapper main-border bg-white mb-2 border-shadow">
        <div class="headWrapper">
          <div class="ope">
            <p class="p">成员排行</p>
            <div>
              <span class="chooseLabel" @click="changeType('0')" :class="{active: showType==='0'}">总</span>
              <span>|</span>
              <span class="chooseLabel" @click="changeType('1')" :class="{active: showType==='1'}">月</span>
              <span>|</span>
              <span class="chooseLabel" @click="changeType('2')" :class="{active: showType==='2'}">周</span>
            </div>
          </div>
          <el-button type="text" @click="getMoreMember()">查看更多</el-button>
        </div>
        <homeMember :homeMemberList='homeMemberList'></homeMember>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import { fetchContentPage } from '@/api/content.js'
import { fetchDictInfo } from '@/api/dict.js'
import { fetchLinessRank, applyIntoWorkshop } from '@/api/member.js'
import { fetchBehaviourById } from '@/api/workshop.js'
import { fetchJyActivityPage } from '@/api/activity.js'

export default {
  name: 'Workshop',
  components: {
    WorkShopNotice: () => import('@/modules/notice/workShopNoticeList.vue'),
    WorkshopInformation: () => import('@/modules/information/workshopInformationList.vue'),
    WorkShopResourceList: () => import('@/modules/resource/workShopResourceList.vue'),
    WorkShopAchievementList: () => import('@/modules/achievement/workShopAchievementList.vue'),
    workshopActivityList: () => import('@/modules/activity/workshopActivityList.vue'),
    homeMember: () => import('./modules/homeMember.vue')
  },
  data() {
    return {
      activeName: 'first',
      homeNoticeList: [],
      informationList: [],
      homeAchievementList: [],
      homeResourceList: [],
      showType: '0',
      homeMemberList: [],
      workshopBehaviour: {},
      workshopActivityList: []
    }
  },
  computed: {
    ...mapGetters(['workshopInfo', 'uuid'])
  },
  watch: {
    workshopInfo: function(val) {
      console.log(val, 'workshopInfo1')
    }
  },
  methods: {
    getWorkshopModuleSum() {
      fetchBehaviourById({ id: this.$route.params.id }).then(response => {
        const data = response.data
        if (data.code === 200) {
          this.workshopBehaviour = data.result
        }
      })
    },
    changeType(type) {
      this.showType = type
      this.getMemberLinessRank()
    },
    getMemberLinessRank() {
      const data = {
        id: this.$route.params.id,
        level: this.showType,
        limit: 5
      }
      fetchLinessRank(data).then(res => {
        if (res.data.code === 200) {
          this.homeMemberList = res.data.result
        }
      })
    },
    async getNoticeList() {
      this.noticeLoading = true
      const noticeCodeInfo = await this.getNoticeCode()
      const contentTypeCodeInfo = noticeCodeInfo.data.result.find(item => {
        if (this.activeName === 'first') {
          return item.dictValue === '公告'
        } else {
          return item.dictValue === '资讯'
        }
      })
      const data = {
        pageCurrent: 1,
        pageSize: 5,
        contentTypeCode: contentTypeCodeInfo.dictKey,
        moduleId: this.$route.params.id
      }
      fetchContentPage(data).then((result) => {
        if (result.data.code === 200) {
          this.noticeLoading = false
          if (this.activeName === 'first') {
            this.homeNoticeList = result.data.result.list
          } else {
            console.log(111111)
            console.log(result.data.result.list)
            this.informationList = result.data.result.list
          }
        }
      }).catch(err => {
        console.log(err)
        this.noticeLoading = !this.noticeLoading
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    getContentList(contentTypeCode) {
      const data = {
        pageCurrent: 1,
        pageSize: 5,
        contentTypeCode: contentTypeCode,
        moduleId: this.$route.params.id
      }
      fetchContentPage(data).then((result) => {
        if (result.data.code === 200) {
          this.homeResourceList = result.data.result.list
          if (contentTypeCode === 'CONTENT_ACHIEVEMENT') {
            this.homeAchievementList = result.data.result.list
          } else if (contentTypeCode === 'CONTENT_RESOURCE') {
            this.homeAchievementList = result.data.result.list
          }
        }
      }).catch(err => {
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    getJyActivityPage() {
      const data = {
        groupId: this.$route.params.id,
        pageCurrent: 1,
        pageSize: 5
      }
      fetchJyActivityPage(data).then(res => {
        console.log(res)
        this.workshopActivityList = res.data.result ? res.data.result.records : []
      })
    },
    handleClick(tab) {
      console.log(tab, event)
      this.getNoticeList()
    },
    getMore(activeName) {
      if (activeName === 'first') {
        this.$router.push({ name: 'noticeList' })
      } else {
        this.$router.push({ name: 'informationList' })
      }
    },
    getMoreMember() {
      this.$router.push({ name: 'memberList' })
    },
    getNoticeCode() {
      return new Promise((resolve, reject) => {
        fetchDictInfo({ dictParentKey: 'CONTENT_STATIONNEWS' }).then(res => {
          resolve(res)
        })
      })
    },
    getApplyIntoWorkshop() {
      const data = {
        groupId: this.$route.params.id,
        userId: this.uuid
      }
      applyIntoWorkshop(data).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getNoticeList()
    this.getContentList('CONTENT_RESOURCE')
    this.getContentList('CONTENT_ACHIEVEMENT')
    this.getMemberLinessRank()
    this.getWorkshopModuleSum()
    this.getJyActivityPage()
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
$name: 'workshop-homeMain-moduel';
.#{$name} {
  .headWrapper {
    width: 100%;
    height: 50px;
    // padding-bottom: 10px;
    font-size: 14px;
    color: #494949;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: solid #ededed 1px;
    box-sizing: border-box;
    align-items: center;
    >>> .el-button {
      color: #b8b8b8;
    }
    .ope{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      height: 50px;
      line-height: 50px;
      width: 50%;
      .chooseLabel{
        cursor: pointer;
      }
      .active{
        color: #409EFF;
      }
    }
    .p {
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      border-bottom: 2px #FF5A00 solid;
      color: #FF5A00;
      margin: 0;
    }
  }
  .home-details{
    display: flex;
    flex-direction: column;
    .informationWrapper{
      min-height: 300px;
      .swiperWrapper{
        width: 340px;
        // height: 260px;
        padding: 10px 20px 10px 10px;
        img{
          width: 100%;
        }
      }
      .contentWrapper{
        position: relative;
        .moreBtn{
          position: absolute;
          right: 10px;
          top: 0px;
        }
        >>> .el-button {
          color: #b8b8b8;
          padding-top: 5px;
        }
      }
    }
    .staticInfoWrapper{
      min-height: 230px;
      .staticsWrapper{
        .totalLinessW{
          min-height: 100px;
          padding: 20px 0px 10px 10px;
          border-bottom: 1px solid #e5e5e5;
          p{
            margin-bottom: 10px;
          }
        }
        .loginCountW{
          padding: 10px 0px 10px 10px;
        }
        .p{
          font-size: 20px;
          color: gray;
        }
      }
    }
    .personal-details{
      position: relative;
      min-height: 385px;
      .personal-banner{
        height: 100px;
        .personal-img{
          width: 100%;
          height: 100%;
        }
      }
      .personal-avatars-wrapper{
        margin: auto;
        display: table;
        .personal-avatars{
          // width: 100px;
          position: relative;
          .logo{
            border: 6px solid #ffffff;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin-top: -37%;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .name{
            font-size: 17px;
          }
          .subject{
            font-size: 14px;
            color: #C4C4C4;
          }
          .label{
            text-align: center;
          }
        }
      }

      .personal-statics{
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 20px 15px 20px 15px;
        .statics-line{
          border-right: 1px #F1F1F1 solid;
        }
        .statics-label{
          width: 30%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .num{
            font-size: 20px;
          }
          .type{
            color: #C4C4C4;
          }
        }
      }
      .personal-button{
        width: 90%;
        height: 50px;
        margin: 10px auto;
        >>> .el-button {
          width: 100%;
          height: 100%;
          background-color: #FEAE4D;
          font-size: 16px;
        }
      }
    }

  }
  .bg-white{
    background: #ffffff;
  }
  .border-shadow{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .main-border{
    border: solid #eeeeee 1px;
    padding: 15px 15px 15px 15px;
    box-sizing: border-box;
  }
  .radius-border{
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
  }
  .flex-grow-1{
    flex: 1
  }
}
</style>
