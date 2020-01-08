<template>
  <div class="head">
    <div>{{title}}</div>
    <div>
      <el-button type="text" @click="goBack">✖</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['title'],
  methods: {
    goBack() {
      this.$emit('goBack')
    }
  }
}
</script>

<style lang='scss'>
.head{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .el-button{
    color: black;
  }
}
</style>
