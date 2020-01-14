<template>
  <div class="notice-wrapper" v-loading="noticeLoading" element-loading-text="拼命加载中">
    <el-row class="notice-details-query" :gutter="10">
      <el-col :span="3">
        <el-input v-model="formQuery.title" placeholder="请输入名称" clearable size="middle"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button @click="search" type="primary">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="notice-details-main">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">公告</p>
          </div>
          <WorkShopNotice :onlyRead="true" :page="'hme'" :homeNoticeList='homeNoticeList'></WorkShopNotice>
          <div class="pagination" v-if="homeNoticeList.length">
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
import { fetchContentPage } from '@/api/content.js'
import { fetchDictInfo } from '@/api/dict.js'
export default {
  name: 'Teaching',
  components: {
    WorkShopNotice: () => import('@/modules/notice/workShopNoticeList')
  },
  data() {
    return {
      noticeLoading: true, // 是否显示加载中
      homeNoticeList: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      },
      formQuery: {
        title: ''
      }
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
    search() {
      this.getNoticeList()
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getNoticeList()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getNoticeList()
    },
    async getNoticeList() {
      this.noticeLoading = true
      const noticeCodeInfo = await this.getNoticeCode()
      const contentTypeCodeInfo = noticeCodeInfo.data.result.find(item => {
        return item.dictValue.indexOf('公告') > -1
      })
      const data = {
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        contentTypeCode: contentTypeCodeInfo.dictKey
      }
      if (this.formQuery.title) {
        data.searchKey = this.formQuery.title
      }
      fetchContentPage(data).then((result) => {
        if (result.data.code === 200) {
          this.noticeLoading = false
          this.homeNoticeList = result.data.result.list
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
    this.getNoticeList()
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.notice-wrapper{
  .notice-details-query{
    margin-bottom: 10px;
  }
  .notice-details-main{
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
