<template>
    <div class="work-activity-wrapper">
      <div class="work-activity-mainBody">
        <div v-if="homeActivityList.length === 0">
          <LayNotData gridType="tb"></LayNotData>
        </div>
        <div class="home-activity" v-if="homeActivityList.length > 0">
          <el-table :data="homeActivityList">
            <el-table-column prop="activityName" show-overflow-tooltip resizable></el-table-column>
            <el-table-column show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
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
