<template>
  <lay-container-query  slot="container">
    <template slot="container">
    <lay-header :logoPic="logo"></lay-header>
    <workshop-menu v-if="isHandlePage" mode="horizontal" :workshopInfo="workshopInfo" :menuData="menuData"></workshop-menu>
    <div class="container" v-if="isBread"><lay-breadcrumb></lay-breadcrumb></div>
    <lay-main></lay-main>
    <lay-footer></lay-footer>
    <lay-back-top></lay-back-top>
    </template>
  </lay-container-query>
</template>

<script>
import LayContainerQuery from './modules/LayContainerQuery'
import LayHeader from './modules/LayHeader'
import WorkshopMenu from './modules/WorkshopMenu'
import LayMain from './modules/LayMain'
import LayFooter from './modules/LayFooter'
import LayBackTop from './modules/LayBackTop'
import workshop from '@/router/modules/workshop'
import { mapGetters } from 'vuex'
// import store from '@/store'
import logoPic from '@/assets/logo.svg'
import LayBreadcrumb from '@/components/LayBreadcrumb'
export default {
  name: 'MainLayout',
  components: { LayContainerQuery, LayHeader, LayMain, LayFooter, WorkshopMenu, LayBreadcrumb, LayBackTop },
  data() {
    return {
      logo: logoPic
    }
  },
  computed: {
    ...mapGetters([
      'workshopInfo', 'uuid', 'workshopUserRoles', 'currentRoute'
    ]),
    menuData: function() {
      // console.log(this.$route)
      // console.log(this.$router.options.routes[4].children)
      console.log(workshop.children, 'workshop.children')
      return workshop.children
    },
    isHandlePage: function() {
      return (this.$route.name !== 'workshopEdit')
    },
    isBread: function() {
      const routerName = this.$route.name
      return (routerName === 'workshopEdit' || routerName === 'noticeAdd' || routerName === 'noticeEdit' || routerName === 'noticeShow' || routerName === 'activityAdd' || routerName === 'activityEdit' || routerName === 'activityShow' || routerName === 'bulletinAdd' || routerName === 'bulletinEdit' || routerName === 'bulletinShow')
    }
  },
  mounted() {
    this.getWorkshopInfo()
  },
  methods: {
    // 获取工作坊详细信息 及 当前登录用户的身份
    getWorkshopInfo: function() {
      var _this = this
      const groupId = _this.$route.params.id
      if (_this.workshopInfo.id || groupId !== _this.workshopInfo.id) {
        // store.dispatch('GetWorkshopDetails', { groupId: groupId }).then(response => {
        //   if (response.code === 200) {
        //     store.dispatch('GetWorkshopModuleSum', { groupId: groupId })
        //     document.title = this.$route.meta.title + '-' + store.getters.workshopInfo.groupName
        //   } else {
        //     // _this.$message({ message: '此活动已被删除', type: 'success' })
        //     // _this.$router.push({ path: '/404' })
        //   }
        // })
      }
    }
  }
}
</script>
