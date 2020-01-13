<template>
    <div class="work-achievement-wrapper">
      <div class="work-achievement-mainBody">
        <div v-if="homeAchievementList.length === 0">
          <LayNotData gridType="tb"></LayNotData>
        </div>
        <div class="home-achievement" v-if="page === 'home' && homeAchievementList.length > 0">
          <el-table :data="homeAchievementList">
            <el-table-column prop="title" show-overflow-tooltip resizable></el-table-column>
            <el-table-column show-overflow-tooltip resizable>
              <template slot-scope="scope">{{scope.row.createTime | parseTime('{y}年{m}月{d}日 星期{a}')}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="work-achievement-list-wrapper" v-if="page !== 'home' && homeAchievementList.length > 0">
          <el-table :data="homeAchievementList" style="width: 100%">
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
                  <el-button type="warning" plain size="mini" v-if="scope.row.verifyStatus === 0" @click="opeNotice(scope.row, 'vertify')">审核</el-button>
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
      <el-dialog
        title="审核资源"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form ref="form" :model="formChoose" label-width="80px">
          <el-form-item label="状态">
            <el-select v-model="formChoose.status">
              <el-option label="通过" value="1"></el-option>
              <el-option label="不通过" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click='sure'>确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { verifyContentPage } from '@/api/content.js'

export default {
  components: {
    LayNotData: () => import('@/modules/LayNotData')
  },
  data() {
    return {
      dialogVisible: false,
      itemCur: {},
      formChoose: {
        status: ''
      }
    }
  },
  props: ['homeAchievementList', 'page', 'index'],
  computed: {
    ...mapGetters([
      'uuid'
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
    homeAchievementList: function(val) {
      if (this.page === 'home' && val.length > 5) {
        this.homeAchievementList.length = 5
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
      if (type === 'vertify') {
        this.dialogVisible = true
      }
    },
    sure() {
      var data = {
        ids: [this.itemCur.id]
      }
      verifyContentPage(data, this.formChoose.status * 1, this.uuid).then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.$emit('getRefresh')
        }
      })
    },
    // 删除公告
    deleteNoticeSingle(item, type) {
      this.$emit('getDeleteContent', type, item)
    }
  }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
.work-achievement-wrapper{
  width: 100%;
  .work-achievement-mainBody{
    // min-height: 100px;
    overflow: hidden;
    .home-achievement{
      /deep/ .el-table__header{
        /deep/ .has-gutter{
          display: none!important
        }
      }
    }
    .work-achievement-list-wrapper{
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
  .work-achievement-wrapper{
    .work-achievement-list-wrapper{
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
  .work-achievement-wrapper{
    .work-achievement-list-wrapper{
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
  .work-achievement-wrapper{
    .work-achievement-list-wrapper{
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
  .work-achievement-wrapper{
    .work-achievement-list-wrapper{
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
  .work-achievement-wrapper{
    .work-achievement-list-wrapper{
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
