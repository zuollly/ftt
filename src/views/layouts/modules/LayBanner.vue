<template>
  <div class="lay-banner"><img :src="workshopCoer"/></div>
</template>
<script>
export default {
  data() {
    return {
      workshopCoer: './static/images/workshopCover.png'
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .lay-banner{
    margin-left: -10px;
    margin-right: -10px;
    height: 400px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
</style>
