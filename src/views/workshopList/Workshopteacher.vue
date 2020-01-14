<template>
  <div class="teaching-wrapper" >
    <el-row class="teaching-details-query" :gutter="10">
      <el-col :span="3">
        <el-select v-model="formQuery.phaseCode" clearable placeholder="请选择学段">
          <el-option
            v-for="item in phaseList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="formQuery.subjectCode" clearable placeholder="请选择学科">
          <el-option
            v-for="item in subjectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="formQuery.groupName" placeholder="请输入工作坊名称" clearable size="middle"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button @click="search" type="primary">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="teaching-details-main">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">名师工作室</p>
            <div class="queryBtn">
              <el-button type="text" :class="{buttonActive: searchType==='visit'}" @click="search('visit')"><svg-icon icon-class="eyes" />访问量<svg-icon icon-class="downward" /></el-button>
              <span>|</span>
              <el-button type="text" :class="{buttonActive: searchType==='active'}" @click="search('active')"><svg-icon icon-class="static" />活跃度<svg-icon icon-class="downward" /></el-button>
            </div>
          </div>
          <WorkshopList :page="'hme'" :workshopList='workshopDataList'></WorkshopList>
          <div class="pagination" >
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
import { fetchDictInfo } from '@/api/dict.js'
import { fetchGroupListPage } from '@/api/workshop.js'
import { studyPhase } from '@/utils/reallyMixin'
export default {
  name: 'Teaching',
  components: {
    WorkshopList: () => import('@/modules/workshop/workshopList.vue')
  },
  mixins: [studyPhase],
  data() {
    return {
      noticeLoading: true, // 是否显示加载中
      workshopDataList: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      },
      formQuery: {
        groupName: '',
        subjectCode: '',
        phaseCode: ''
      },
      subjectList: [],
      phaseList: [],
      searchType: 'visit'
    }
  },
  computed: {
    ...mapGetters([
      '',
      'isMobile'
    ])
  },
  watch: {
  },
  methods: {
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getGroupListPage()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getGroupListPage()
    },
    search(name) {
      if (name) {
        this.searchType = name
      }
      this.getGroupListPage()
    },
    getGroupListPage() {
      this.noticeLoading = true
      const data = {
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        // state: 1,
        groupType: 'teacher',
        desc: ['group_views']
      }
      if (this.searchType === 'visit') {
        data.desc = ['group_views']
      } else if (this.searchType === 'active') {
        data.desc = ['group_liveness']
      }
      if (this.formQuery.groupName) {
        data.groupName = this.formQuery.groupName
      }
      if (this.formQuery.subjectCode) {
        data.subjectCode = this.formQuery.subjectCode
      }
      if (this.formQuery.phaseCode) {
        data.segmentCode = this.formQuery.phaseCode
      }
      fetchGroupListPage(data, 2).then((result) => {
        if (result.data.code === 200) {
          this.noticeLoading = false
          this.workshopDataList = result.data.result.records
          this.pageObj.count = result.data.result.total
        }
      }).catch(err => {
        console.log(err)
        this.noticeLoading = !this.noticeLoading
        this.$message({ type: 'warning', message: `${err}` })
      })
    },
    issueNotice() {

    },
    getNoticeCode() {
      return new Promise((resolve, reject) => {
        fetchDictInfo({ dictParentKey: 'CONTENT_STATIONNEWS' }).then(res => {
          resolve(res)
        })
      })
    }
  },
  mounted() {
    this.getGroupListPage()
    this.subject().then(res => {
      console.log(res)
      this.subjectList = res
    })
    this.phase().then(res => {
      this.phaseList = res
    })
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.teaching-wrapper{
  .teaching-details-query{
    margin-bottom: 10px;
  }
  .teaching-details-main{
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
      /deep/ .el-button--text {
        color: #b8b8b8;
      }
      .buttonActive{
         color: #409EFF!important;
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
