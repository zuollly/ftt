<template>
  <div class="container-fluid">
    <lay-header v-if="isLogin"></lay-header>
    <lay-main></lay-main>
    <lay-footer></lay-footer>
  </div>
</template>

<script>
import LayHeader from './modules/LayHeader'
import LayBanner from './modules/LayBanner'
import LayMain from './modules/LayMain'
import LayFooter from './modules/LayFooter'
// import workshopList from '@/router/modules/workshop'
export default {
  name: 'UserLayout',
  components: { LayHeader, LayMain, LayFooter, LayBanner },
  computed: {
    isLogin: function() {
      return (this.$route.name !== 'login')
    }
    // menuData: function() {
    //   return workshopList.children
    // }
  }
}
</script>
