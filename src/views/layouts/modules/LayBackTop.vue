<template>
  <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
  <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
  <el-tooltip placement="left" content="回到顶部">
    <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="300" :backPosition="0"></back-to-top>
  </el-tooltip>
</template>
<script>
export default {
  name: 'LayBack',
  components: {
    BackToTop: () => import('@/components/BackToTop')
  },
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  }
}
</script>
