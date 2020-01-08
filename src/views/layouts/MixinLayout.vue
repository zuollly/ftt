<template>
  <lay-container-query  slot="container">
    <template slot="container">
      <lay-header></lay-header>
      <!-- <lay-banner></lay-banner> -->
      <lay-main></lay-main>
      <lay-footer></lay-footer>
    </template>
  </lay-container-query>
</template>
<script>
import LayContainerQuery from './modules/LayContainerQuery'
import LayHeader from './modules/LayHeader'
import LayMain from './modules/LayMain'
import LayFooter from './modules/LayFooter'
export default {
  components: { LayContainerQuery, LayHeader, LayMain, LayFooter }
}
</script>
<style lang="scss" scoped>
</style>
