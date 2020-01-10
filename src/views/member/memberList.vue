<template>
  <div class="memberListWrapper">
    <el-row class="member-details-main">
      <el-col class="home-details">
        <div class="informationWrapper main-border bg-white mb-2 border-shadow">
          <div class="headWrapper">
            <el-radio-group v-model="searchType">
              <el-radio-button label="member">成员列表</el-radio-button>
              <el-radio-button label="apply">待审核列表</el-radio-button>
            </el-radio-group>
            <el-button v-if="searchType==='member'" type="primary" size="small">邀请成员</el-button>
            <div v-if="searchType==='apply'">
              <el-button type="primary" @click="opeSomeMember('pass')" size="small">通过</el-button>
              <el-button type="danger" @click="opeSomeMember('reject')" size="small">拒绝</el-button>
            </div>
          </div>
          <div v-if="searchType==='member'" class="memberConWrapper">
            <div class="memberCon" v-for="(item, idx) in memberList" :key="idx">
              <div class="settingBtn">
                <el-tooltip class="item" effect="dark" content="删除成员" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="设置助理" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-setting" circle></el-button>
                </el-tooltip>
              </div>
              <div class="image">
                <img :src="item.avatar" alt="">
              </div>
              <p class="label name">{{item.realname}}</p>
              <p class="label role">
                <span>{{item.roleName}}</span>
                <span v-if="item.careerLevelName">|</span>
                <span v-if="item.careerLevelName">{{item.careerLevelName}}</span>
                <span v-if="item.schoolName">|</span>
                <span v-if="item.schoolName">{{item.schoolName}}</span>
              </p>
              <div class="desc" @mouseover="selectStyle(item)" @mouseout="outStyle(item)">
                <span v-if="item.description">
                  {{item.description}}
                </span>
                <span v-else class="noDesc">
                  <svg-icon class="noDescSvg" iconClass='noDesc'></svg-icon>
                </span>
                <svg-icon class="arrow" :icon-class="item.iconClass" />
              </div>
            </div>
          </div>
          <div v-if="searchType==='apply'" class="memberApplyWrapper">
            <el-table :row-key="getRowKey" @selection-change="handleSelectionChange" :data="memberApplyList" style="width: 100%">
              <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
              <el-table-column label="头像" width="200">
                <template slot-scope="scope">
                  <img style="width: 70px; height: 70px" :src="scope.row.avatar" alt="">
                </template>
              </el-table-column>
              <el-table-column prop="realname" label="姓名" width="250"></el-table-column>
              <el-table-column label="申请时间" width="300">
                <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
              </el-table-column>
              <el-table-column label="审核时间" width="300">
                <template slot-scope="scope">
                  <span v-if="scope.row.verifyTime">{{scope.row.verifyTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</span>
                  <span v-else>暂无</span>
                </template>
              </el-table-column>
              <el-table-column label="审核结果" width="180">
                <template slot-scope="scope">{{scope.row.verifyStatus | verifyStatusTurn}}</template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="button">
                    <el-button type="danger" plain size="mini" @click="opeMember(scope.row, 'reject')">拒绝</el-button>
                    <el-button type="primary" plain size="mini" @click="opeMember(scope.row, 'pass')">通过</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination
              background
               @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 12, 15, 18]"
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
import { fetchMemberPage, fetchApplyMemberPage, verifyMember } from '@/api/member.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      memberList: [],
      memberApplyList: [],
      searchType: 'member',
      iconClass: 'upward',
      multipleSelection: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      }
    }
  },
  computed: {
    ...mapGetters(['uuid'])
  },
  watch: {
    searchType: function(val) {
      if (val === 'apply') {
        this.getApplyMemberPage()
      } else {
        this.getMemberPage()
      }
    }
  },
  filters: {
    verifyStatusTurn(val) {
      let value = ''
      switch (val) {
        case 0:
          value = '待处理'
          break
        case 1:
          value = '通过'
          break
        case 2:
          value = '不通过'
          break
      }
      return value
    }
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    opeSomeMember(type) {
      const data = {}
      const ids = []
      this.multipleSelection.forEach((ele, index) => {
        ids[index] = ele.id
      })
      if (!ids.length) {
        this.$message.warning('请选择一条数据操作')
        return false
      }
      if (type === 'pass') {
        data.ids = ids
        data.verifyStatus = 1
        data.verifyUserId = this.uuid
      }
      if (type === 'reject') {
        data.ids = ids
        data.verifyStatus = 2
        data.verifyUserId = this.uuid
      }
      this.updateMemberStatus(data)
    },
    opeMember(item, type) {
      console.log(item)
      const data = {}
      if (type === 'pass') {
        data.ids = [item.id]
        data.verifyStatus = 1
        data.verifyUserId = this.uuid
      }
      if (type === 'reject') {
        data.ids = [item.id]
        data.verifyStatus = 2
        data.verifyUserId = this.uuid
      }
      this.updateMemberStatus(data)
    },
    updateMemberStatus(data) {
      verifyMember(data).then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.searchType = 'apply'
          this.getApplyMemberPage()
        }
      })
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      if (this.searchType === 'member') {
        this.getMemberPage()
      } else {
        this.getApplyMemberPage()
      }
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      if (this.searchType === 'member') {
        this.getMemberPage()
      } else {
        this.getApplyMemberPage()
      }
    },
    getMemberPage() {
      const data = {
        groupId: this.$route.params.id,
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize
      }
      fetchMemberPage(data).then(res => {
        res.data.result.list.forEach(item => {
          item.iconClass = 'upward'
        })
        this.memberList = res.data.result.list
        this.pageObj.count = res.data.result.total
      })
    },
    getApplyMemberPage() {
      const data = {
        groupId: this.$route.params.id,
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        verifyStatus: 0
      }
      fetchApplyMemberPage(data).then(res => {
        this.memberApplyList = res.data.result.list
        this.pageObj.count = res.data.result.total
      })
    },
    selectStyle(item) {
      item.iconClass = 'down'
    },
    outStyle(item) {
      item.iconClass = 'upward'
    }
  },
  mounted() {
    this.getMemberPage()
  }
}
</script>
<style lang="scss" scoped>
.memberListWrapper{
  .member-details-main{
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
    }
    .home-details{
      display: flex;
      flex-direction: column;
      .informationWrapper{
        min-height: 320px;
        .memberConWrapper{
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 20px 10px 10px 10px;
          .memberCon{
            background: #F5F5F5;
            border-radius: 15px;
            width: 32%;
            height: 320px;
            margin-right: 2%;
            margin-bottom: 20px;
            position: relative;
            .settingBtn{
              text-align: right;
              padding-top: 8px;
              padding-right: 10px;
              // position: absolute;
              // top: 0;
              // left: 0;
            }
            .image{
              width: 100%;
              // height: 100px;
              text-align: center;
              // margin-top: 15px;
              img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
              }
            }
            .label{
              text-align: center;
              width: 100%;
              height: 30px;
              line-height: 30px;
            }
            .name{
              font-size: 16px;
            }
            .role{
              font-size: 14px;
              color: #cecece;
            }
            .desc{
              position: absolute;
              height: 100px;
              width: 100%;
              background: #409EFE;
              bottom: 0;
              color: #fff;
              border-bottom-left-radius: 6px;
              border-bottom-right-radius: 6px;
              transition: all .8s;
              font-size: 14px;
              padding: 20px;
              cursor: pointer;
              .arrow{
                position: absolute;
                top: -15px;
                left: calc(50% - 12px);
                width: 35px;
                height: 35px;
              }
              .noDesc{
                display: inline-block;
                height: 100%;
                width: 100%;
                text-align: center;
                .noDescSvg{
                  height: 100%;
                  width: 50%;
                }
              }
            }
            .desc:hover{
              height: 320px;
            }
          }
          .memberCon:nth-child(3n){
            margin-right: 0%;

          }
        }
        .memberApplyWrapper{
          min-height: 320px;
          padding: 20px;
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
