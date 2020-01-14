<template>
    <div class="work-activity-wrapper">
      <div class="work-activity-mainBody">
        <div v-if="homeActivityList.length === 0">
          <LayNotData gridType="tb"></LayNotData>
        </div>
        <div class="home-activity" v-if="page === 'home'&&homeActivityList.length > 0">
          <el-table :data="homeActivityList">
            <el-table-column prop="activityName" show-overflow-tooltip resizable></el-table-column>
            <el-table-column show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="work-activity-list-wrapper" v-if="page !== 'home' && homeActivityList.length > 0">
          <el-table :row-key="getRowKey" ref="resourceTable" @selection-change="handleSelectionChange" :data="homeActivityList" style="width: 100%">
            <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
            <el-table-column label="标题" width="250" show-overflow-tooltip resizable>
              <template slot-scope="scope">
                <a class="span bg-purple" @click="opeNotice(scope.row, 'view')">{{scope.row.activityName}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName"  width="150" label="发布者" show-overflow-tooltip resizable></el-table-column>
            <el-table-column prop="groupName"  width="150" label="工作坊" show-overflow-tooltip resizable></el-table-column>
            <el-table-column label="发布日期" show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
            </el-table-column>
            <el-table-column prop="date" label="操作">
              <template slot-scope="scope">
                <div class="button">
                  <el-button type="success" plain size="mini" @click="opeNotice(scope.row, 'view')">查看</el-button>
                  <el-button type="primary" plain size="mini" @click="opeNotice(scope.row, 'edit')">编辑</el-button>
                  <el-button type="warning" v-if="scope.row.verifyStatus === 0" plain size="mini" @click="opeNotice(scope.row, 'vertify')">审核</el-button>

                  <el-button type="danger" plain size="mini" @click="deleteNoticeSingle(scope.row, 'single')">删除</el-button>
                </div>
                <div class="mobile-button">
                  <el-dropdown size="small" split-button type="primary">
                    操作
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button type="success" size="mini" @click="opeNotice(scope.row, 'view')">查看</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button type="primary" size="mini" @click="opeNotice(scope.row, 'edit')">编辑</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button type="warning" v-if="scope.row.verifyStatus === 0" plain size="mini" @click="opeNotice(scope.row, 'vertify')">审核</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button type="danger" size="mini" @click="deleteNoticeSingle(scope.row, 'single')">删除</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    LayNotData: () => import('@/modules/LayNotData')
  },
  data() {
    return {
    }
  },
  props: ['homeActivityList', 'page'],
  computed: {
    ...mapGetters([

    ])
  },
  filters: {
    statusChange(val) {
      let value = ''
      switch (val) {
        case 1:
          value = '草稿'
          break
        case 2:
          value = '已发布'
          break
        case 3:
          value = '已撤回'
          break
      }
      return value
    }
  },
  watch: {
    homeActivityList: function(val) {
      if (this.page === 'home' && val.length > 5) {
        this.homeActivityList.length = 5
      }
    }
  },
  methods: {
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.work-activity-wrapper{
  width: 100%;
  .work-activity-mainBody{
    // min-height: 100px;
    overflow: hidden;
    .home-activity{
      /deep/ .el-table__header{
        /deep/ .has-gutter{
          display: none!important
        }
      }
    }
    .work-activity-list-wrapper{
      padding: 15px 0 15px 0;
      .span{
        cursor: pointer;
        color: #494545;
      }
      .mobile-button{
        display: none;
      }
    }
  }
}
.screen-xs{
  .work-activity-wrapper{
    .work-activity-list-wrapper{
      .button{
        display: none;
      }
      .mobile-button{
        display: block;
      }
    }
  }
}
.screen-sm{
  .work-activity-wrapper{
    .work-activity-list-wrapper{
      .button{
        display: none;
      }
      .mobile-button{
        display: block;
      }
    }
  }
}
.screen-md{
  .work-activity-wrapper{
    .work-activity-list-wrapper{
      .button{
        display: none;
      }
      .mobile-button{
        display: block;
      }
    }
  }
}
.screen-lg{
  .work-activity-wrapper{
    .work-activity-list-wrapper{
      .button{
        display: none;
      }
      .mobile-button{
        display: block;
      }
    }
  }
}
.screen-xl{
  .work-activity-wrapper{
    .work-activity-list-wrapper{
      .button{
        display: none;
      }
      .mobile-button{
        display: block;
      }
    }
  }
}
</style>
