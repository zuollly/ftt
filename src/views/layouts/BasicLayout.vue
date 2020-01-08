<template>
  <lay-container-query>
    <template slot="container">
    <lay-header :menuData="menuData"></lay-header>
    <lay-banner></lay-banner>
    <lay-main></lay-main>
    <lay-footer></lay-footer>
    <lay-back-top></lay-back-top>
    </template>
  </lay-container-query>
</template>

<script>
import LayContainerQuery from './modules/LayContainerQuery'
import LayHeader from './modules/LayHeader'
import LayBanner from './modules/LayBanner'
import LayMain from './modules/LayMain'
import LayFooter from './modules/LayFooter'
import LayBackTop from './modules/LayBackTop'
import workshopList from '@/router/modules/workshopList'
export default {
  name: 'BasicLayout',
  components: { LayContainerQuery, LayHeader, LayMain, LayFooter, LayBanner, LayBackTop },
  computed: {
    menuData: function() {
      console.log(workshopList.workshopList, 'workshopList')
      return workshopList.children
    }
  }
}
</script>
