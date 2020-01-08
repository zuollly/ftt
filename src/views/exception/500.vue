<template>
  <div class="lay-exception d-flex justify-content-center p-4">
    <div><svg-icon icon-class="500" /></div>
    <div class="align-self-center">
      <h1 class="m-0">500</h1>
      <p>抱歉，服务器出错了</p>
      <router-link to="/"><span class="el-button el-button--primary el-button--medium">回到首页</span> </router-link>
    </div>
  </div>
</template>
<script></script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .lay-exception{
    .svg-icon{
      width: 430px; height: 360px;
    }
    h1{
      font-size: 72px;
      font-weight: 600;
      color: #434e59;
    }
    p{
      font-size: 18px;
      color: #999;
      font-weight: 300;
    }
  }
</style>
