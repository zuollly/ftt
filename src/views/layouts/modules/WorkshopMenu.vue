<template>
  <div class="container mt-2">
    <div class="workshop-header">
      <div class="workshop-body">
        <div class="workshop-banner" v-lazy-container="{ selector: 'img'}">
          <span class="img-set">
            <img class="banner-coer" :data-src="workshopInfo.groupImg" :data-error="workshopCoer" :data-loading="appConfig.cfg_img_loading">
          </span>
        </div>
        <div class="workshop-details">
          <span class="details-header">{{workshopInfo.groupName}}&nbsp;<small>{{workshopInfo.adminUserName}}</small></span>
          <div class="workshop-type">
            <span>
              <svg-icon icon-class="subject" /> 创建时间：{{workshopInfo.createTime}}
            </span>
            <span>
              <el-tooltip class="item" effect="dark" content="科目" placement="bottom"><svg-icon icon-class="subject" /></el-tooltip> {{workshopInfo.groupSegSubs?workshopInfo.groupSegSubs[0].segSubtName:''}}
            </span>
          </div>
        </div>
        <el-button class="workshop-edit" type="primary" size="medium" icon="el-icon-edit" @click="editWorkshop" plain>编辑工作室资料</el-button>
      </div>
      <div class="workshop-menu">
        <nav-menu mode="horizontal" :menuData="menuData" :currentRoute="currentRoute"></nav-menu>
      </div>
    </div>
    <el-dialog
      :title="workshopInfo.groupName + ' - 工作坊简介'"
      :visible.sync="workshopDetailsDialogVisible"
      :width="dialogWidth">
      <div class="lay-details" v-html="workshopInfo.introduction">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NavMenu from './menu/NavMenu'
import { mapGetters } from 'vuex'
import { applyWorkshop } from '@/api/user'
// import { delWorkshopById } from '@/api/workshop'
export default {
  name: 'WorkshopMenu',
  components: { NavMenu },
  data() {
    return {
      workshopCoer: './static/images/topBanner.jpg',
      workshopDetailsDialogVisible: false,
      workshopId: this.$route.params.id,
      loading: false
    }
  },
  props: {
    menuData: {
      type: Array
    },
    workshopInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  watch: {
    workshopInfo: function(val) {
      console.log(val, 'workshopInfo')
    }
  },
  mounted() {
    console.log(this.appConfig.cfg_workshop_banner)
  },
  computed: {
    ...mapGetters([
      'appConfig', 'currentRoute'
    ]),
    dialogWidth: function() {
      console.log(`-----------` + this.browserInfo)
      return this.isMobile ? '90%' : '50%'
    }
  },
  methods: {
    // 去登录
    isUserLogin() {
      this.$confirm('您还没有登录，是否要去登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/user/login', query: { redirect: this.$route.fullPath }
        })
      }).catch(() => {
        return false
      })
    }, // 申请加入工作坊
    applyWorkshop: function() {
      var _this = this
      const groupId = _this.workshopId
      if (_this.userId) {
        _this.loading = false
        applyWorkshop({ groupId }).then(response => {
          if (response.data.code === 200) {
            _this.$store.dispatch('GetWorkshopUserRoles', { groupId: _this.$route.params.id }).then((res) => {
              if (response.data.code === 200) {
                _this.$message({
                  message: '申请成功', type: 'success'
                })
                _this.loading = false
              } else {
                _this.$message('申请失败了')
                _this.loading = false
              }
            })
          } else {
            _this.$message('申请失败了')
            _this.loading = false
          }
        })
      } else {
        this.isUserLogin()
      }
    },
    editWorkshop: function() {
      this.$router.push({
        name: 'workshopEdit', params: { id: this.workshopId }
      })
    },
    delWorkshop: function() {
      var _this = this
      // const groupId = [_this.workshopId]
      this.$confirm('如果删除与本工作坊相关数据都将清空,您确定要删除本工作坊吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.loading = true
        // delWorkshopById({ groupId }).then(response => {
        //   if (response.data.code === 200) {
        //     _this.$message({
        //       message: '删除成功', type: 'success'
        //     })
        //     _this.loading = false
        //     _this.$router.push({
        //       path: '/'
        //     })
        //   } else {
        //     _this.$message({
        //       message: '删除失败', type: 'success'
        //     })
        //   }
        //   _this.loading = false
        // })
      }).catch(() => {
        return false
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .workshop-header{
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    .workshop-body{
      position: relative;
      border-bottom: 1px solid #ebeef5;
      .workshop-details{
        position: absolute;
        top: 0%;
        left: 10%;
        width: 50%;
        height: 280px;
        // line-height: 280px;
        color: white;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        .details-header{
          font-size: 34px;
        }
        .workshop-type{
          span{
            font-size: 16px;
            display: inline-block;
            padding: 5px 20px 10px 0;
            color: #ffffff;
          }
        }
      }
      .workshop-edit{
        position: absolute;
        bottom: 20px;
        right: 20px;
        // width: 10%;
        // height: 50px;
      }
    }
    .workshop-banner{
      min-height: 300px;
      max-height: 300px;
      width: 100%;
      height: 300px;
      overflow: hidden;
      padding: 1px;
      line-height: 300px;
      display:block;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      filter: brightness(0.8);
      img{
        /*width: 100%;*/
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
      }
      img.banner-coer[lazy=loading]  {
        width: 30px;
        height: 30px;
        // vertical-align: center;
        align-items: center;
        margin-left: auto!important;
        margin-right: auto!important;
        display: block!important;
      }
      img.banner-coer[lazy=error]  {
        width: 100%;
        height: 100%;
      }
      img.banner-coer[lazy =loaded]  {
        width: 100%;
        height: 100%;
      }
    }
    .workshop-banner-btn{
      position: absolute;
      top:10px;
      right: 10px;
    }
    .workshop-btn{
      position: absolute;
      top:115px;
      right: 10px;
    }
    .workshop-info{
      margin-left: 180px;
    }
    .workshop-Logo{
      position: absolute;
      top:50px;
      left: 20px;
      .img-set{
        position: relative;
        width: 140px;
        height: 140px;
        overflow: hidden;
        background-color: #fafafa;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.2);
        text-align: center;
        display: flex;
        line-height: 140px;
      }
      img{
        align-items: center;
      }
      img.mini-cover[lazy=loading]  {
        width: 30px;
        height: 30px;
        margin-left: auto!important;
        margin-right: auto!important;
        display: block!important;
      }
      img.mini-cover[lazy=error]  {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .workshop-title{
      margin: 0px;
      font-size: 20px;
      font-weight: 600;
      small{
        font-weight: 400;
        font-size: 14px;
        color: #666;
      }
    }
    .workshop-type{
      span{
        display: inline-block; padding: 5px 20px 10px 0;
        color: #666;
      }
    }
    .workshop-desc{
      color: #666;
      padding-right: 15px;
    }
    .workshop-menu{
      .el-menu{
        padding: 0 20px;
      }
      .el-menu-item{
        padding: 0 30px;
        font-size: 15px;
      }
    }
    .el-menu--horizontal>.el-menu-item.is-active{
      color: #409EFF;
    }
    .el-menu--horizontal>.el-menu-item{
      color: #333;
    }
  }
  .lay-details{
    line-height: 28px;
  }
  .screen-xs{
    .workshop-header{
      .workshop-body{}
      .workshop-banner{
        img{}
        img.banner-coer[lazy=loading]  {}
        img.banner-coer[lazy=error]  {}
        img.banner-coer[lazy =loaded]  {}
      }
      .workshop-banner-btn{}
      .workshop-btn{top: 15px;}
      .workshop-info{
        margin-left: 10px;
      }

      .workshop-Logo{
        top: 15px;
        left: 10px;
        .img-set{
          width: 70px;
          height: 70px;
          line-height: 70px;
        }
        img{
          align-items: center;
        }
        img{max-width: 70px;}
        img.banner-coer[lazy=loading]  {
          width: 20px;
          height: 20px;
        }
      }
      .workshop-title{
        small{}
      }
      .workshop-type{}
      .workshop-desc{}
      .workshop-menu{
        .el-menu{padding: 0 10px;}
        .el-menu-item{padding: 0 11px;}
      }
      .lay-details{}
    }
    .el-message-box{
      width: 80%;
    }
  }
  .screen-sm{
    .workshop-header{
      .workshop-body{}
      .workshop-banner{
        img{}
        img.banner-coer[lazy=loading]  {}
        img.banner-coer[lazy=error]  {}
        img.banner-coer[lazy =loaded]  {}
      }
      .workshop-banner-btn{}
      .workshop-btn{
        top: 15px;
      }
      .workshop-info{
        margin-left: 10px;
      }
      .workshop-Logo{
        top: 15px;
        left: 10px;
        .img-set{
          width: 70px;
          height: 70px;
          line-height: 70px;
        }
        img{
          align-items: center;
        }
        img{max-width: 70px;}
        img.banner-coer[lazy=loading]  {
          width: 20px;
          height: 20px;
        }
      }
      .workshop-title{
        small{}
      }
      .workshop-type{}
      .workshop-desc{}
      .workshop-menu{
        .el-menu{padding: 0 10px;}
        .el-menu-item{padding: 0 25px;}
      }
      .lay-details{}
    }
    .el-message-box{
      width: 80%;
    }
  }
  .screen-md{
    .workshop-header{
      .workshop-body{}
      .workshop-banner{
        img{}
        img.banner-coer[lazy=loading]  {}
        img.banner-coer[lazy=error]  {}
        img.banner-coer[lazy =loaded]  {}
      }
      .workshop-banner-btn{}
      .workshop-btn{
        top: 15px;
      }
      .workshop-info{
        margin-left: 10px;
      }
      .workshop-Logo{
        top: 15px;
        left: 10px;
        .img-set{
          width: 70px;
          height: 70px;
          line-height: 70px;
        }
        img{
          align-items: center;
        }
        img{max-width: 70px;}
        img.banner-coer[lazy=loading]  {
          width: 20px;
          height: 20px;
        }
      }
      .workshop-title{
        small{}
      }
      .workshop-type{}
      .workshop-desc{}
      .workshop-menu{
        .el-menu{padding: 0 10px;}
        .el-menu-item{padding: 0 25px;}
      }
      .lay-details{}
    }
    .el-message-box{
      width: 80%;
    }
  }
</style>
