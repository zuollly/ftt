<template>
    <div class="all-member-wrapper">
      <div class="all-member-list">
        <div class="all-member-list-body" v-for="(item, index) in homeMemberList" :key="index">
            <span v-if="userRole === 0">
                <el-checkbox v-if="item.header !== 1" v-model="item.checked"></el-checkbox>
                <el-checkbox v-else v-model="headercheck" disabled=""></el-checkbox>
            </span>
            <span v-else-if="userRole === 1">
                <el-checkbox v-if="item.admin !== 1" v-model="item.checked"></el-checkbox>
                <el-checkbox v-else v-model="headercheck" disabled=""></el-checkbox>
            </span>
          <img class="img" :src="item.userVO.avatar | domain($store.getters.appConfig.cfg_upfile_path, $store.getters.appConfig.cfg_user_face_not)" alt="">
          <div class="all-member-main-body">
            <p class="media-username"><span :class="colorChoose(item.header, item.admin)">{{item.userVO.real}}</span>
            <svg-icon :iconClass='"groupAdmin"' :class="colorChoose(item.header, item.admin)+' groupAdmin'"></svg-icon>
            </p>
            <p class="media-userinfo"><span>学科：</span><span>{{item.userVO.subjName | subjectFilter}}</span><span style="margin: 0 10px 0 10px">  |  </span><span>加入时间：</span><span>{{item.joinTime | jionTimeFilter | parseTime('{y}年{m}月{d}日')}}</span></p>
            <p :class="desColor(item.description)">{{item.userVO.sign | descriptionFilter}}</p>
          </div>
          <div v-if="userRole === 0">
              <div v-if="item.header !== 1">
              <div class="all-member-main-operator" v-if="item.admin === 1">
                <div class="btn">
                <el-button type="warning"  size='mini' @click="manageThis(index, 0)">撤销</el-button>
                </div>
                <div class="btn">
                <el-button type="danger"  size='mini' @click="deleteMember(index)">删除</el-button>
                </div>
                </div>
                <div class="all-member-main-operator" v-else>
                <div class="set">
                <el-button type="primary"  size='mini' @click="manageThis(index, 1)">设置副坊主</el-button>
                </div>
                <div class="btn">
                <el-button type="danger"  size='mini' @click="deleteMember(index)">删除</el-button>
                </div>
                </div>
                </div>
          </div>
          <div v-else-if="userRole === 1">
           <el-button v-if="item.admin !== 1" type="danger"  size='mini' @click="deleteMember(index)">删除</el-button>
          </div>
          </div>
      </div>
       <div v-if="count === 0"><lay-not-data gridType="tb" :imgHeigth="Number(200)" :textDisc="暂无数据"></lay-not-data></div>
       <div class="pagination" v-if="count > 9">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="optionsTotal.currentPage"
          :page-size="optionsTotal.pageSize"
          :total.sync="count">
        </el-pagination>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      checked: true,
      optionsTotal: {
        currentPage: 1,
        pageSize: 10
      },
      userRole: Number,
      headercheck: false
    }
  },
  components: {
    LayNotData: () => import('@/modules/LayNotData')
  },
  props: ['homeMemberList', 'count'],
  filters: {
    descriptionFilter(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return '暂无描述信息'
      } else {
        return val
      }
    },
    subjectFilter(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return '暂无信息'
      } else {
        return val
      }
    },
    jionTimeFilter(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return '暂无信息'
      } else {
        return val
      }
    }
  },
  mounted() {
    console.log(this.count, 'i')
    this.getCurrentRole()
  },
  methods: {
    // set color of userName when its null
    desColor(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return 'description-default'
      } else {
        return 'media-description'
      }
    },
    // 设置坊主 副坊主 成员颜色
    colorChoose(admin, header) {
      if (admin === 1) {
        // 坊主
        return 'color-org'
      } else {
        if (header === 1) {
          return 'color-gre'
        } else if (header === 0) {
          return ''
        }
      }
    },
    // 删除成员
    deleteMember(index) {
      this.$emit('deleteMember', index)
    },
    // 设置管理权限
    manageThis(index, type) {
      const query = {
        index: index,
        type: type
      }
      this.$emit('manageThis', query)
    },
    getCurrentRole() {
      const role = this.$store.state.user.workshopUserRoles
      // 0-坊主 1-副坊主  2-参与人员  3-申请人员  4-报名未通过人员  5-没有参与工作坊的成员 6-管理员
      console.log('role: ', role)
      for (const item of role) {
        this.userRole = item
      }
    },
    handleCurrentChange(index) {
      // console.log(index)
      this.$emit('getCurrentPage', index)
    }
  }
}
</script>
<style lang='scss'>
.all-member-wrapper {
  border-top: none;
  background: #fff;
  padding: 0px 10px 4px 10px;
  box-sizing: border-box;
  .all-member-list {
    .all-member-list-body {
      border-bottom: 1px #eeeeee solid;
      box-sizing: border-box;
      padding: 10px 15px 10px 15px;
      height: calc(100% - 30px);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .el-checkbox {
        margin-right: 15px;
        input {
          margin: 0 auto;
        }
      }
      .img {
        width: 45px;
        height: 45px;
        border-radius: 5px;
      }
      .all-member-main-body {
        margin-left: 10px;
        flex: 1;
        width: 70%;
      }
      .all-member-main-operator {
        width: 15%;
        display: flex;
        font-size: 12px;
        flex-flow: row-reverse center;
        .set {
          flex: 3;
          text-align: center;
          margin-right: 10px;
        }
        .btn {
          flex: 1;
          text-align: center;
          margin-right: 10px;
        }
      }
    }
  }
  .pagination {
    display: table; /* 宽度不确定元素居中 */
    margin: 0 auto;
    padding: 20px;
  }
}
.imgshow {
  width: 50px;
  height: 50px;
  flex: 1;
}
.color-org {
  color: #e6a23c;
}
.color-gre {
  color: #67c23a;
}
.groupAdmin {
  margin-left: 2px;
}
.media-description {
  color: #606266;
  font-size: 13px;
}
// .media-username {
//   font-size: 16px;
// }
.description-default {
  color: #c0c4cc;
}
.media-userinfo {
  color: #909399;
}
</style>
