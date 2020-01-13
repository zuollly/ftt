<template>
  <el-breadcrumb class="lay-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="{name:item.name,params:{id: $route.params.id}}">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  props: {
    isModule: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    $route(val) {
      console.log(val, 'val')
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      // console.log(this.$route.matched)
      const matched = this.$route.matched.filter(item => item.name)
      // if (this.isModule) {
      //   const first = matched[0]
      //   if (first && first.name !== 'workshopList') {
      //     matched = [{
      //       path: '/', meta: { title: '首页' }
      //     }].concat(matched)
      //   }
      // }
      console.log(this.$route, matched, 'matched--')
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .lay-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    // line-height: 50px;
    padding-top: 20px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
