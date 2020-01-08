<template>
  <el-footer>
    <div class="text-center text-muted lay-footer mt-3 mb-3">
      <span v-html="this.$store.getters.appConfig.cfg_powerby"></span>
    </div>
  </el-footer>
</template>
<style>
  .lay-footer{
    line-height: 60px;
  }
</style>
