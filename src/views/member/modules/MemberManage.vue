<template>
   <div>
     <div class="all_member_btn_wrapper">
        <div class="all_member_btn">
          <el-checkbox v-model="memberCheckAll">全部</el-checkbox>
          <el-button type="danger"  size="mini" @click="getDeleteMember">批量删除</el-button>
          <el-button type="primary" icon="el-icon-circle-plus-outline"  size="mini" v-if="userRole === 0" @click="setMemberAll">批量设置副坊主</el-button>
        </div>
      </div>
    <MemberItem :count='optionsTotal.count' :homeMemberList='homeMemberList' @getCurrentPage='getCurrentPage' @deleteMember="deleteThis" @manageThis="manageThis"></MemberItem>
    </div>
</template>
<script>
import { getMemberList, deleteMember, setMemberManage } from '@/api/member.js'
export default {
  components: {
    MemberItem: () => import('./MemberItem.vue')
  },
  data() {
    return {
      homeMemberList: [],
      optionsTotal: {
        currentPage: 1,
        pageSize: 10
      },
      actId: '',
      groupId: '',
      userId: '',
      orderList: {},
      userRole: Number
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
    }
  },
  mounted() {
    this.getBaseInfo()
    this.getMemberInfo()
  },
  methods: {
    // 批量设置副坊主
    setMemberAll() {
      const checkedArr = this.homeMemberList.filter(item => {
        if (item.header !== 1) {
          return item.checked === true
        }
      })
      console.log(checkedArr)
      const querylist = []
      for (const item of checkedArr) {
        querylist.push({
          actId: this.actId,
          groupId: this.groupId,
          userId: this.userId,
          id: item.id
        })
      }
      const type = 1
      this.manageMember(querylist, type)
    },
    closeChoose(data) {
      this.chooseVisible = false
      if (data === undefined) return
      this.invitePerson = data
    },
    deleteThis(index) {
      const arr = this.homeMemberList[index]
      const querylist = []
      querylist.push(arr)
      this.deleteMembers(querylist)
    },
    manageThis(data) {
      console.log('data: ', data)
      const querylist = []
      querylist.push(this.homeMemberList[data.index])
      const type = data.type
      this.manageMember(querylist, type)
    },
    // 设置权限
    manageMember(querylist, type) {
      let mes = ''
      if (type === 0) {
        mes = '撤销成功'
      } else {
        mes = '设置成功'
      }
      setMemberManage(querylist, type).then(result => {
        console.log('result: ', result)
        if (result.data.code === 200) {
          this.$message({ type: 'success', message: `${mes}` })
          this.getMemberInfo()
        }
      })
    },
    // 获取基本信息
    getBaseInfo() {
      this.actId = this.$route.params.activityId
      this.groupId = this.$route.params.id
      this.userId = this.$store.state.user.userId
      const role = this.$store.state.user.workshopUserRoles
      console.log('role: ', role)
      for (const item of role) {
        this.userRole = item
      }
    },
    // 获取被勾选成员  批量删除成员
    getDeleteMember() {
      const checkedArr = this.homeMemberList.filter(item => {
        if (this.userRole === 0) {
          if (item.header !== 1) {
            return item.checked === true
          }
        } else if (this.userRole === 1) {
          if (item.admin !== 1) {
            return item.checked === true
          }
        }
      })
      console.log(checkedArr)
      const querylist = []
      for (const item of checkedArr) {
        querylist.push({
          actId: this.actId,
          groupId: this.groupId,
          userId: this.userId,
          id: item.id
        })
      }
      this.deleteMembers(querylist)
    },
    deleteMembers(querylist) {
      deleteMember(querylist).then(result => {
        if (result.data.code === 200) {
          this.$message({ type: 'success', message: `删除成功` })
          this.getMemberInfo()
        }
      })
    },
    // 获取'所有成员'当前页码
    getCurrentPage(index) {
      console.log(index, '1')
      this.optionsTotal.currentPage = index
      this.getMemList()
    },
    getMemberInfo() {
      const data = {
        groupId: this.$route.params.id,
        currentPage: this.optionsTotal.currentPage,
        header: 0,
        admin: 1,
        pageSize: this.optionsTotal.pageSize
      }
      this.getMemList(data)
    },
    getMemList(data) {
      this.orderList = data
      getMemberList(data)
        .then(result => {
          console.log('result: ', result)
          if (result.data.code === 200) {
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
          console.error(err)
          this.$message({ type: 'warning', message: `${err}` })
        })
    },
    handleCurrentChange(index) {
      // console.log(index)
      this.$emit('getCurrentPage', index)
    }
  }
}
</script>
<style lang='scss'>
.member_details {
  .member_details_main {
    .all_member_btn_wrapper {
      padding: 0 15px 0px 15px;
      background: #fff;
      .all_member_btn {
        height: 80px;
        padding: 20px 15px 20px 15px;
        border-bottom: 1px #eeeeee solid;
        line-height: 40px;
      }
    }
    .el-tabs__header {
      margin: 0;
      position: static;
      bottom: 0;
    }
    .el-tabs__item {
      font-size: 14px;
      line-height: 40px;
      background-color: #fff;
      border-bottom: 1px #eee solid !important;
      box-sizing: border-box;
    }
    .member_radios .el-radio-group {
      margin-bottom: 0 !important;
      .el-radio-button__inner {
        // border-bottom: none;
        border-radius: 0;
      }
      .is-active {
        border-bottom: none;
        background-color: #fff;
      }
    }
  }
}
</style>
