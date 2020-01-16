<template>
  <div class="container">
    <el-row class="workshop-homeMain-moduel" :gutter="10">
        <el-col class="home-details" :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
          <div class="informationWrapper informationNotice d-flex main-border bg-white mb-2 border-shadow">
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
          <div class="informationWrapper informationTeacher main-border bg-white mb-2 border-shadow">
            <div class="informationContent contentWrapper">
              <el-tabs v-model="activeName1">
                <el-tab-pane label="名师工作室" name="first">
                  <WorkshopList :workshopList='workshopDataList'></WorkshopList>
                </el-tab-pane>
                <!-- <el-tab-pane label="名校长工作室" name="second">名校长工作室</el-tab-pane> -->
              </el-tabs>
              <el-button class="moreBtn" @click="getMoreWorkShop('teacherHome')" size="middle" type="text">查看更多</el-button>
            </div>
          </div>
        </el-col>
        <el-col class="home-details" :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
          <div class="informationWrapper informationLiveness main-border bg-white mb-2 border-shadow">
            <div class="headWrapper">
              <p class="p">工作室活跃度排行</p>
              <el-button type="text" @click="getMoreWorkShop('teacherHome')">查看更多</el-button>
            </div>
            <workshopByOrdersList :homeWorkByOrderList='workshopListByOrders'></workshopByOrdersList>
          </div>
          <div class="informationWrapper informationLiveness main-border bg-white mb-2 border-shadow">
            <div class="headWrapper">
              <p class="p">工作室活动</p>
              <el-button type="text" @click="getMoreWorkShop('workshopActivity')">查看更多</el-button>
            </div>
            <workshopActivityList :page="'home'" :homeActivityList='workshopActivityList'></workshopActivityList>
          </div>
        </el-col>
    </el-row>
    <el-row class="workshop-homeMain-moduel">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">资源</p>
            <el-button type="text" @click="getMoreWorkShop('resourceHome')">查看更多</el-button>
          </div>
          <homeResource :resourcetDataList='resourcetDataList'></homeResource>
        </div>
      </el-col>
    </el-row>
    <el-row class="workshop-homeMain-moduel">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">成果展示</p>
            <el-button type="text" @click="getMoreWorkShop('achievementHome')">查看更多</el-button>
          </div>
          <homeAchievement :achievementDataList='achievementDataList'></homeAchievement>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchContentPage, fetchRelevanceContentPage } from '@/api/content.js'
import { fetchDictInfo } from '@/api/dict.js'
import { fetchGroupListPage, fetchWorkshopListByOrders } from '@/api/workshop.js'
import { fetchJyActivityPage } from '@/api/activity.js'
export default {
  components: {
    WorkShopNotice: () => import('@/modules/notice/workShopNoticeList'),
    WorkshopInformation: () => import('@/modules/information/workshopInformationList.vue'),
    WorkshopList: () => import('@/modules/workshop/workshopList.vue'),
    workshopByOrdersList: () => import('@/modules/workshop/workshopByOrdersList.vue'),
    workshopActivityList: () => import('@/modules/activity/workshopActivityList.vue'),
    homeResource: () => import('./components/homeResource.vue'),
    homeAchievement: () => import('./components/homeAchievement.vue')
  },
  data() {
    return {
      activeName: 'first',
      homeNoticeList: [],
      informationList: [],
      workshopDataList: [],
      workshopListByOrders: [],
      achievementDataList: [],
      resourcetDataList: [],
      activeName1: 'first',
      workshopActivityList: []
    }
  },
  mounted() {
    this.getNoticeList()
    this.getGroupListPage()
    this.getRelevanceContentPage('CONTENT_RESOURCE')
    this.getRelevanceContentPage('CONTENT_ACHIEVEMENT')
    this.getJyActivityPage()
    this.getWorkshopListByOrders()
  },
  computed: {
  },
  methods: {
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
        contentTypeCode: contentTypeCodeInfo.dictKey
      }
      fetchContentPage(data).then((result) => {
        if (result.data.code === 200) {
          this.noticeLoading = false
          if (this.activeName === 'first') {
            this.homeNoticeList = result.data.result.list
          } else {
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
    getGroupListPage() {
      const data = {
        pageCurrent: 1,
        pageSize: 4,
        groupType: 'teacher'
      }
      fetchGroupListPage(data, 0).then((result) => {
        if (result.data.code === 200) {
          this.workshopDataList = result.data.result ? result.data.result.records : []
        }
      }).catch(err => {
        console.log(err)
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    getWorkshopListByOrders() {
      const data = {
        descs: [
          'group_liveness'
        ],
        pageCurrent: 1,
        pageSize: 6
      }
      fetchWorkshopListByOrders(data).then((result) => {
        if (result.data.code === 200) {
          this.workshopListByOrders = result.data.result ? result.data.result.records : []
        }
      }).catch(err => {
        console.log(err)
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    getJyActivityPage() {
      const data = {
        // groupId: this.$route.params.id,
        pageCurrent: 1,
        pageSize: 6
      }
      fetchJyActivityPage(data).then(res => {
        console.log(res)
        this.workshopActivityList = res.data.result ? res.data.result.records : []
      })
    },
    getRelevanceContentPage(contentTypeCode) {
      const data = {
        pageCurrent: 1,
        pageSize: 5,
        contentTypeCode: contentTypeCode,
        limit: 3
      }
      fetchRelevanceContentPage(data).then((result) => {
        if (result.data.code === 200) {
          this.noticeLoading = false
          if (contentTypeCode === 'CONTENT_RESOURCE') {
            this.resourcetDataList = result.data.result.list
          } else {
            this.achievementDataList = result.data.result.list
          }
        }
      }).catch(err => {
        console.log(err)
        this.noticeLoading = !this.noticeLoading
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    handleClick(tab) {
      console.log(tab, event)
      this.getNoticeList()
    },
    getMore(activeName) {
      if (activeName === 'first') {
        this.$router.push({ name: 'noticeHome' })
      } else {
        this.$router.push({ name: 'informationHome' })
      }
    },
    getMoreWorkShop(name) {
      this.$router.push({ name: name })
    },
    getNoticeCode() {
      return new Promise((resolve, reject) => {
        fetchDictInfo({ dictParentKey: 'CONTENT_STATIONNEWS' }).then(res => {
          resolve(res)
        })
      })
    }
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
    .p {
      height: 50px;
      line-height: 50px;
      padding: 0 5px;
      border-bottom: 2px #FF5A00 solid;
      color: #FF5A00;
    }
  }
  .home-details{
    display: flex;
    flex-direction: column;
    .informationWrapper{
      min-height: 350px;
      .swiperWrapper{
        width: 340px;
        // height: 260px;
        padding: 10px 20px 10px 10px;
        img{
          width: 93%;
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
          // padding-top: 5px;
        }
      }
    }
    .informationTeacher{
      height: 450px;
    }
    .informationNotice{
      height: 300px;
    }
    .informationLiveness{
      height: 400px;
      height: 400px;
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
  .flex-grow-1{
    flex: 1
  }
  /deep/ .el-tabs__active-bar{
    background-color: #FF5A00;
  }
  /deep/ .el-tabs__item.is-active {
    color: #FF5A00;
  }
  /deep/ .el-tabs__item:hover {
    color: #FF5A00;
    cursor: pointer;
  }
}
</style>

