<template>
    <div class="work-notice-wrapper">
      <div class="work-notice-mainBody">
        <div v-if="informationList.length === 0">
          <LayNotData gridType="tb"></LayNotData>
        </div>
        <div class="home-notice" v-if="page === 'home' && informationList.length > 0">
          <el-table :data="informationList">
            <el-table-column prop="title" show-overflow-tooltip resizable></el-table-column>
            <el-table-column show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="work-notice-list-wrapper" v-if="page !== 'home' && informationList.length > 0">
          <el-table :data="informationList" style="width: 100%">
            <el-table-column label="公告标题" width="350" show-overflow-tooltip resizable>
              <template slot-scope="scope">
                <a class="span bg-purple" @click="opeNotice(scope.row, 'view')">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="userName"  width="150" label="发布者" show-overflow-tooltip resizable></el-table-column>
            <el-table-column label="发布日期" show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
            </el-table-column>
            <el-table-column prop="date" label="操作">
              <template slot-scope="scope">
                <div class="button">
                  <el-button type="success" plain size="mini" @click="opeNotice(scope.row, 'view')">查看</el-button>
                  <el-button type="primary" plain size="mini" @click="opeNotice(scope.row, 'edit')">编辑</el-button>
                  <!-- <el-button type="warning" plain size="mini" v-if="scope.row.status !== 2" @click="opeNotice(scope.row, 'issue')">发布</el-button> -->
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
                      <!-- <el-dropdown-item>
                        <el-button type="warning" size="mini" v-if="scope.row.status !== 2" @click="opeNotice(scope.row, 'issue')">发布</el-button>
                      </el-dropdown-item> -->
                      <el-dropdown-item>
                        <el-button type="warning" size="mini" v-if="scope.row.status === 2" @click="opeNotice(scope.row, 'withdraw')">撤回</el-button>
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
  name: 'WorkShopNotice',
  components: {
    LayNotData: () => import('@/modules/LayNotData')
  },
  data() {
    return {
    }
  },
  props: ['informationList', 'page', 'index'],
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
    informationList: function(val) {
      if (this.page === 'home' && val.length > 5) {
        this.informationList.length = 5
      }
    }
  },
  methods: {
    opeNotice(item, type) {
      const workshopId = this.$route.params.id
      if (type === 'edit') {
        this.$emit('editContent', item)
      }
      if (type === 'view') {
        this.$router.push({
          name: 'noticeShow', params: { id: workshopId, noticeId: item.id }, query: { index: this.index }
        })
      }
    },
    // 删除
    deleteNoticeSingle(item, type) {
      this.$emit('getDeleteContent', type, item)
    }
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.work-notice-wrapper{
  width: 100%;
  .work-notice-mainBody{
    // min-height: 100px;
    overflow: hidden;
    .home-notice{
      /deep/ .el-table__header{
        /deep/ .has-gutter{
          display: none!important
        }
      }
    }
    .work-notice-list-wrapper{
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
  .work-notice-wrapper{
    .work-notice-list-wrapper{
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
  .work-notice-wrapper{
    .work-notice-list-wrapper{
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
  .work-notice-wrapper{
    .work-notice-list-wrapper{
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
  .work-notice-wrapper{
    .work-notice-list-wrapper{
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
  .work-notice-wrapper{
    .work-notice-list-wrapper{
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
