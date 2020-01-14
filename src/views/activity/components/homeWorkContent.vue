 <template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="我的作业" name="first">
        <div class="homeWork" v-if="homeWorkInfo.length <= 0">
          <p>您还没有提交作业</p>
          <el-button type="primary" @click="tosubmitHomeWork">提交作业</el-button>
        </div>
        <el-table class="homeWork" :data="homeWorkInfo" v-else style="width: 100%">
          <el-table-column prop="userName" label="提交者" width="180"></el-table-column>
          <el-table-column prop="updateTime" label="提交时间" width="180"></el-table-column>
          <el-table-column label="是否推荐" width="180">
            <template slot-scope="scope">{{scope.row.recommend | recommendTurn}}</template>
          </el-table-column>
          <el-table-column label="成绩" width="180">
            <template slot-scope="scope">{{scope.row.score | scoreTurn}}</template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <span>评论{{`(${scope.row.comments||0})`}}</span>
              <span>阅读{{`(${scope.row.views||0})`}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="全部作业" name="second">
        <el-table :data="homeWorkInfo" style="width: 100%">
          <el-table-column prop="userName" label="提交者" width="180"></el-table-column>
          <el-table-column prop="updateTime" label="提交时间" width="180"></el-table-column>
          <el-table-column label="是否推荐" width="180">
            <template slot-scope="scope">{{scope.row.recommend | recommendTurn}}</template>
          </el-table-column>
          <el-table-column label="成绩" width="180">
            <template slot-scope="scope">{{scope.row.score | scoreTurn}}</template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <span>评论{{`(${scope.row.comments})`}}</span>
              <span>阅读{{`(${scope.row.views})`}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :current-page.sync="optionsTotal.currentPage"
            :page-size="optionsTotal.pageSize"
            :total.sync="optionsTotal.count">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <submitHomeWork :opeType='opeType' :homeWorkList='homeWorkList' :submitHomeWorkVisible='submitHomeWorkVisible' @sure='sureHomeDialog' @closeHomeWorkVisible='closeHomeWorkVisible'></submitHomeWork>
  </div>
</template>

<script>
import { fetchSubmitHomeWorkPage } from '@/api/activityCopy.js'
import { mapGetters } from 'vuex'
export default {
  props: ['homeWorkList'],
  components: {
    submitHomeWork: () => import('./submitHomeWork.vue')
  },
  data() {
    return {
      homeWorkInfo: [],
      activeName: 'first',
      optionsTotal: { // 分页信息
        currentPage: 1,
        pageSize: 10,
        count: 0
      },
      opeType: '',
      submitHomeWorkVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'uuid',
      ''
    ])
  },
  watch: {
    homeWorkList: function(val) {
      if (val.length) {
        this.queryHomeWorkPage({ homeworkId: val[0].serviceId, userId: this.uuid })
      }
    }
  },
  methods: {
    tosubmitHomeWork() {
      this.opeType = 'add'
      this.submitHomeWorkVisible = true
    },
    closeHomeWorkVisible() {
      this.opeType = ''
      this.submitHomeWorkVisible = false
    },
    sureHomeDialog() {
      this.opeType = ''
      this.submitHomeWorkVisible = false
      this.$message.success('作业提交成功')
      this.queryHomeWorkPage({ homeworkId: this.homeWorkList[0].serviceId, userId: this.uuid })
    },
    handleCurrentChange(index) {
      this.optionsTotal.currentPage = index
      this.queryHomeWorkPage({
        pageCurrent: this.optionsTotal.currentPage,
        pageSize: this.optionsTotal.pageSize
      })
    },
    queryHomeWorkPage(obj) {
      this.fetchSubmitHomeWorkPage(obj).then(res => {
        if (res.data.code === 200) {
          this.homeWorkInfo = res.data.result ? res.data.result.records : []
          this.optionsTotal.count = res.data.result ? res.data.result.total : 0
        }
      })
    },
    fetchSubmitHomeWorkPage(params) {
      return new Promise((resolve, reject) => {
        fetchSubmitHomeWorkPage(params).then(res => {
          resolve(res)
        })
      })
    },
    handleClick(tab, event) {
      this.optionsTotal.currentPage = 1
      if (this.activeName === 'first') {
        this.queryHomeWorkPage({ homeworkId: this.homeWorkList[0].serviceId, userId: this.uuid })
      } else {
        this.queryHomeWorkPage({
          homeworkId: this.homeWorkList[0].serviceId,
          pageCurrent: this.optionsTotal.currentPage,
          pageSize: this.optionsTotal.pageSize
        })
      }
    }
  },
  filters: {
    recommendTurn(val) {
      let str = ''
      switch (val) {
        case 0:
          str = '未推荐'
          break
        case 1:
          str = '推荐'
          break
        default:
          str = ''
      }
      return str
    },
    scoreTurn(val) {
      let str = ''
      switch (val) {
        case 0:
          str = '未批阅'
          break
        case 1:
          str = '优秀'
          break
        case 2:
          str = '良好'
          break
        case 3:
          str = '合格'
          break
        case 4:
          str = '不合格'
          break
        default:
          str = ''
      }
      return str
    }
  },
  mounted() {
    this.queryHomeWorkPage({ homeworkId: this.homeWorkList[0].serviceId, userId: this.uuid })
  }
}
</script>

<style lang="scss" scoped>
.homeWork{
  padding-bottom: 30px;
  margin: 0 auto;
  display: table;
}
.pagination{
  margin: 0 auto;
  display: table;
  height: 50px;
  padding-top: 10px;
}
</style>

