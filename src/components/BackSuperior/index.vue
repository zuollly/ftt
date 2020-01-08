<template>
  <div class="backWrapper">
    <el-button size="small" @click="goToBack" type="warning">返回</el-button>
  </div>
</template>

<script>
export default {
  name: 'BackSuperior',
  props: {

  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    goToBack() {
      // this.$emit('goBack')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.backWrapper{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: right;
  background: white;
  padding-right: 20px;
  border: 1px solid #fafafa;
  box-sizing: border-box;
}
</style>
