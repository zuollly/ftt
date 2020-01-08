<template>
  <div class="workshop-list">
    <el-row>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <div class="media media-box">
            <!-- <div v-lazy-container="{ selector: 'img'}"><img :key="appConfig.cfg_up_path + shoplist.logo" class="mr-3 imgshow" :data-src="appConfig.cfg_up_path + shoplist.logo" data-error="./static/images/workshopLogo.png" data-loading="./static/images/loading.gif"></div> -->
            <img class="mr-3" :src="shoplist.activityImg" alt="">
            <div class="media-list">
              <h5 class="mt-2 media-title" @click="enterActivity(workshopItem)">{{shoplist.activityName}}</h5>
              <div class="media-span">
                <svg-icon :iconClass='"calendars"' class="svg"></svg-icon>
                <span>创建于{{shoplist.createTime}}</span>
                <!-- <svg-icon :iconClass='"section"' class="subject svg-position"></svg-icon>
                <span>科目：{{shoplist.subjectName}}</span> -->
                <svg-icon :iconClass='"admins"' class="svg svg-position"></svg-icon>
                <span>创建人：{{shoplist.creatorName}}</span>
                <svg-icon :iconClass='"member"' class="member svg-position"></svg-icon><span>成员：{{shoplist.joinCount}}人</span>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" :content="shoplist.description" placement="top-start">
                  <p class="media-content">{{shoplist.activityIntroduction}}</p>
                </el-tooltip>
                <el-button type="primary" size="mini"  @click="enterActivity(workshopItem)">进入活动</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card-opera">
            <el-button class="ml-2" type="success" size="mini" @click="editActivity(shoplist)">编辑活动</el-button>
            <el-button class="ml-2" type="danger" size="mini" icon="el-icon-delete" @click="deleteActivity(workshopItem.id)"></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { deleteJyActivity } from '@/api/activityCopy'
export default {
  props: ['workshopItem'],
  data() {
    return {
      src:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544156372741&di=662aedbe7fb84f1b541e4750d4f508f0&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F91ef76c6a7efce1b5ef04082a251f3deb58f659b.jpg'
    }
  },
  computed: {
    shoplist() {
      const list = this.workshopItem
      if (list.label) {
        let label = list.label
        if (label.indexOf(',') || label.indexOf('，')) {
          label = label.replace(/，/g, ',')
          // console.log('list: ', list)
          let res = []
          if (label) {
            res = label.split(',')
            list.label = res
          }
        }
      }
      return list
    },
    ...mapGetters([
      'appConfig',
      'isMobile'
    ])
  },
  mounted() {
    // this.getRoleInfo()
  },
  methods: {
    editActivity(row) {
      console.log(row)
      this.$router.push({
        name: 'activityInfo', query: { activityId: row.id }}
      )
    },
    deleteActivity(id) {
      this.$confirm('是否确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = [id]
        deleteJyActivity(ids).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.$emit('getList')
          }
        })
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消' })
        return false
      })
    },
    enterActivity(row) {
      console.log(row)
      this.$router.push({
        name: 'activityShow', params: { activityId: row.id }}
      )
    }
  },
  filters: {
    truncation(val) {
      if (val.length > 50) {
        return val.slice(0, 49) + '...'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.imgshow {
  width: 150px;
  height: 150px;
  border-radius: 4px;
}
.card-shoplist {
  width: 100%;
  border-bottom: solid 1px #dcdfe6;
  min-height: 160px;
}
.media-title {
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}
.card-opera {
  min-width: 100%;
  margin-top: 70px;
  margin-right: 20px;
  //   height: 150px;
  text-align: right;
}
.media-list {
  width: 800px;
}
.media-content {
  width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 33px;
  color: #606266;
}
.media-content-mobile{
  display: none;
}
.media-content-lg{
  display: none;
}
.media-box {
  padding-top: 10px;
  padding-bottom: 10px;
  float: left;
  img{
    width: 150px;
    height: 150px;
    border-radius: 4px;
  }
}
.media-span {
  span {
    margin-left: 5px;
    font-size: 14px;
    line-height: 24px;
    color: #606266;
  }
}
.svg {
  font-size: 18px;
}
.svg-position {
  margin-left: 12px;
}
.subject {
  font-size: 15px;
}
.member {
  font-size: 21px;
}
.workshop-list{
  .mobile-button{
    max-width: 200px;
    margin-top: 10px;
    display: none;
  }
  .media-span{
    display: block;
  }
  .media-span-mobile{
    display: none;
  }
}
</style>

