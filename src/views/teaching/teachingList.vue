<template>
  <div class="teaching-wrapper" v-loading="noticeLoading" element-loading-text="拼命加载中">
    <el-row class="teaching-details-main">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">互动教研</p>
            <el-button v-if="workshopPermissionInfo.ACTIVITY_INSERT" type="primary" size="mini" @click="addTeaching">新增教研</el-button>
          </div>
          <div class="activityContent">
            <div v-for="(item, index) in workshopActivityList" :key="index">
              <ActItem class="check-item" :workshopItem="item" @getList='getList'></ActItem>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              background
               @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 30]"
              :current-page.sync="pageObj.pageCurrent"
              :page-size="pageObj.pageSize"
              :total.sync="pageObj.count">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { fetchJyActivityPage } from '@/api/activity.js'
export default {
  name: 'TeachingList',
  components: {
    ActItem: () => import('./modules/ActItem.vue')
  },
  data() {
    return {
      noticeLoading: false, // 是否显示加载中
      workshopActivityList: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'workshopPermissionInfo',
      'isMobile'
    ])
  },
  watch: {
  },
  methods: {
    addTeaching() {
      console.log(this.$route.params)
      this.$router.push({
        name: 'teachingAdd', query: { templateId: 'e005d2e35634c0e0548ee13000ced241' }})
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getJyActivityPage()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getJyActivityPage()
    },
    getList() {
      this.getJyActivityPage()
    },
    getJyActivityPage() {
      const data = {
        groupId: this.$route.params.id,
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        activityThemeCode: '0_JATD1'
      }
      fetchJyActivityPage(data).then(res => {
        console.log(res)
        this.workshopActivityList = res.data.result ? res.data.result.records : []
        this.pageObj.count = res.data.result.total
      })
    }
  },
  mounted() {
    this.getJyActivityPage()
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.teaching-wrapper{
  .teaching-details-main{
    .headWrapper {
      width: 100%;
      height: 50px;
      // padding-bottom: 10px;
      font-size: 14px;
      // color: #494949;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: solid #ededed 1px;
      box-sizing: border-box;
      align-items: center;
      >>> .el-button {
        // color: #b8b8b8;
      }
      .p {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        border-bottom: 2px #FF5A00 solid;
        color: #FF5A00;
      }
    }
    .home-details{
      display: flex;
      flex-direction: column;
      .informationWrapper{
        min-height: 300px;
        .activityContent{
          padding-top: 20px;
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
}
</style>
