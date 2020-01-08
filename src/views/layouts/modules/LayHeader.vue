<template>
  <el-header class="lay-header-container">
    <div class="container">
      <div class="lay-header d-flex justify-content-around">
        <div class="lay-header-logo">
          <router-link to="/"><img :src="appConfig.cfg_weblogo"> <h1>{{appConfig.cfg_webname}}</h1></router-link>
        </div>
        <div class="workshop-menu">
          <nav-menu mode="horizontal" :menuData="menuData" :currentRoute="currentRoute"></nav-menu>
        </div>
        <div class="lay-header-global">
          <!-- <span class="lay-header-search lay-header-action">
            <el-input placeholder="请输入内容" size="medium">
              <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </span> -->
          <template v-if="uuid === ''">
            <el-button type="primary" @click="gotoLogin" size="medium">登录</el-button>
          </template>
          <template v-else>
            <span class="lay-header-user lay-header-action">
              <span class="el-dropdown-link">
                <span class="lay-header-user-avatar">
                  <img :src="userAvatar | domain(appConfig.cfg_upfile_path, appConfig.cfg_user_face_not)" class="align-middle rounded"/>
                </span>
                <span class="el-dropdown-link nav-link">
                  <svg-icon icon-class="user" />{{userName}}
                </span>
              </span>
            </span>
          </template>
        </div>
      </div>
    </div>
  </el-header>
</template>
<script>
import { mapGetters } from 'vuex'
import NavMenu from './menu/NavMenu'
export default {
  name: 'LayHeader',
  components: { NavMenu },
  props: {
    logoPic: {
      type: String
    },
    menuData: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([
      'uuid', 'userName', 'userAvatar', 'appConfig', 'currentRoute'
    ])
  },
  methods: {
    gotoLogin: function() {
      this.$router.push({
        path: '/user/login', query: { redirect: this.$route.fullPath }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.lay-header-container{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: background .3s,width .2s;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background-color: #fff;
  z-index: 1000;
  .lay-header-logo{
    width: 165px;
    height: 60px;
    position: relative;
    line-height: 60px;
    transition: all .3s;
    overflow: hidden;
    a{
      text-decoration: none;
    }
    img, h1{
      display: inline-block;
    }
    img{
      vertical-align: middle;
      height: 30px;
    }
    h1{
      vertical-align: top;
      font-size: 16px;
      margin: 0 0 0 12px;
      font-weight: 400;
    }
  }
  .lay-header{
    line-height: 60px;
  }
  .nav-link{
    font-size: 15px;
  }
  .lay-header-action{
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    transition: all .3s;
    height: 100%;
  }
  .lay-header-user{
    .lay-header-user-avatar{
      display: inline-block; line-height: 60px;
      img{width: 32px; height: 32px; vertical-align: -11px; border: 0}
    }
  }
}
</style>
