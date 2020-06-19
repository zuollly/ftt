<template>
  <div class="training-wrapper" v-loading="noticeLoading" element-loading-text="拼命加载中">
    <el-row class="training-details-main">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <p class="p">培训</p>
          </div>
          <div class="headWrapper">
            <el-radio-group v-model="joinstatus">
              <el-radio-button label=0>全部</el-radio-button>
              <el-radio-button label=1>我参与的</el-radio-button>
              <el-radio-button label=2>我报名的</el-radio-button>
            </el-radio-group>
            <div>
              <el-button type="primary" @click="addTraining" size="small">新增培训</el-button>
              <el-select size="small" v-model="activityStatus">
                <el-option label="全部培训" value=""></el-option>
                <el-option label="进行中" value="1"></el-option>
                <el-option label="已结束" value="2"></el-option>
                <el-option label="未开始" value="0"></el-option>
              </el-select>
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
import { fetchTrainPage } from '@/api/train.js'
export default {
  name: 'TrainingList',
  components: {
    ActItem: () => import('./modules/ActItem.vue')
  },
  data() {
    return {
      noticeLoading: false, // 是否显示加载中
      workshopTrainList: [],
      joinstatus: 0,
      activityStatus: '',
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'uuid'
    ])
  },
  watch: {
  },
  methods: {
    addTraining() {
      console.log(this.$route.params)
      this.$router.push({
        name: 'trainingAdd', query: { templateId: 'dc732c86b0931af658f0f2f5f3cf7a83' }})
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getJyTrainPage()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getJyTrainPage()
    },
    getJyTrainPage() {
      const data = {
        groupId: this.$route.params.id,
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        userId: this.uuid,
        joinstatus: 0
      }
      fetchTrainPage(data).then(res => {
        console.log(res)
        this.workshopTrainList = res.data.result ? res.data.result.records : []
        this.pageObj.count = res.data.result ? res.data.result.total : 0
      })
    }
  },
  mounted() {
    this.getJyTrainPage()
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.training-wrapper{
  .training-details-main{
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
