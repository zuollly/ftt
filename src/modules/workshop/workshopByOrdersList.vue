<template>
    <div class="work-activity-wrapper">
      <div class="work-activity-mainBody">
        <div v-if="homeWorkByOrderList.length === 0">
          <LayNotData gridType="tb"></LayNotData>
        </div>
        <div class="home-activity" v-if="homeWorkByOrderList.length > 0">
          <el-table :data="homeWorkByOrderList">
            <el-table-column show-overflow-tooltip resizable>
              <template slot-scope="scope">
                <a class="span bg-purple" @click="enterWorkshop(scope.row)">{{scope.row.groupName}}</a>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime}}</template>
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
  props: ['homeWorkByOrderList', 'page'],
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
    homeWorkByOrderList: function(val) {
      if (this.page === 'home' && val.length > 5) {
        this.homeWorkByOrderList.length = 5
      }
    }
  },
  methods: {
    enterWorkshop(item) {
      console.log(item)
      this.$router.push({ name: 'workshop',
        params: { id: item.id }})
    }
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
