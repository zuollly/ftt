<template>
   <div class="apply_member" v-loading="memberLoading" element-loading-text="拼命加载中">
     <div class="all_member_btn_wrapper">
        <div class="all_member_btn" v-if="homeMemberList.length > 0">
          <el-checkbox class="pass" v-model="memberCheckAll">全部</el-checkbox>
          <el-button type="success" size="mini" @click="getOperatorMember('batch', 'pass')">批量通过</el-button>
          <el-button type="danger" size="mini" @click="getOperatorMember('batch', 'refuse', item)">批量拒绝</el-button>
        </div>
      </div>
      <MemberApplyItem :count='optionsTotal.count' @getRefuseApplyMember='getOperatorMember' :homeMemberList='homeMemberList' @getCurrentPage='getCurrentPage'></MemberApplyItem>
      <div class="pagination" v-if="homeMemberList.length > 0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="optionsTotal.currentPage"
          :page-size="optionsTotal.pageSize"
          :total.sync="optionsTotal.count">
        </el-pagination>
      </div>
    </div>
</template>
<script>
import { getApplyMember, verifyMember } from '@/api/member.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    MemberApplyItem: () => import('./MemberApplyItem.vue')
  },
  data() {
    return {
      homeMemberList: [],
      outerVisible: false,
      checkedPersonId: [],
      memberLoading: true,
      optionsTotal: {
        currentPage: 1,
        pageSize: 10,
        count: 0
      }
    }
  },
  computed: {
    memberCheckAll: {
      get() {
        let flag = true
        this.homeMemberList.forEach(item => {
          if (!item.checked) {
            flag = false
          }
        })
        return flag
      },
      set(newVal) {
        this.homeMemberList.forEach(item => {
          item.checked = newVal
        })
      }
    },
    ...mapGetters([
      'workshopUserRoles'
    ])
  },
  mounted() {
    this.getMemberInfo()
  },
  methods: {
    // 获取被勾选成员  批量操作成员
    getOperatorMember(type, status, item) {
      console.log(item)
      const groupId = this.$route.params.id
      const dataList = []
      if (type === 'batch') {
        const checkedArr = this.homeMemberList.filter((item) => {
          return item.checked === true
        })
        if (checkedArr.length === 0) {
          this.$message({ message: '请先选择人员', type: 'warning' })
          return false
        }
        console.log(checkedArr, '00000')
        for (const value of checkedArr) {
          dataList[dataList.length] = { id: value.id, userId: value.userVO.userId, groupId: groupId }
        }
      }
      if (type === 'single') { // 单个不通过
        dataList.push({ id: item.id, userId: item.userVO.userId, groupId: groupId })
      }
      let txt = null
      let flag = null
      if (status === 'pass') {
        txt = '通过'
        flag = true
      } else if (status === 'refuse') {
        txt = '拒绝'
        flag = false
      }
      this.$confirm(`是否确认${txt}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.memberLoading = true
        verifyMember(dataList, flag).then((result) => {
          if (result.data.code === 200) {
            this.memberLoading = false
            this.$message({ type: 'success', message: '操作成功' })
            this.getMemberInfo()
          }
        })
      }).catch(err => {
        console.error(err)
        this.$message({ type: 'warning', message: `${err}` })
        this.memberLoading = false
      })
    },
    // 获取'所有成员'当前页码
    getCurrentPage(index) {
      console.log(index, '1')
      this.optionsTotal.currentPage = index
      this.getMemberInfo()
    },
    getMemberInfo() {
      const groupId = this.$route.params.id
      const data = {
        groupId: groupId,
        currentPage: this.optionsTotal.currentPage,
        pageSize: this.optionsTotal.pageSize
      }
      this.getMemList(data)
    },
    getMemList(data) {
      this.orderList = data
      getApplyMember(data)
        .then(result => {
          console.log('result: ', result)
          if (result.data.code === 200) {
            this.memberLoading = false
            const res = result.data.result
            res.records.forEach(element => {
              element.checked = false
            })
            this.homeMemberList = res.records
            console.log(this.homeMemberList, 'member``')
            this.optionsTotal.count = res.total
          }
        })
        .catch(err => {
          this.memberLoading = false
          this.$message({ type: 'warning', message: `${err}` })
        })
    },
    handleCurrentChange(index) {
      this.memberLoading = true
      this.optionsTotal.currentPage = index
      this.getMemberInfo()
    }
  }
}
</script>
<style lang='scss' scoped>
.apply_member{
  .pass{
    margin-right: 20px;
  }
}
</style>
