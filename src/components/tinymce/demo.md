<template>
  <div>
    <editor class="editor" v-model="remark" :height="200" :toolbarNum="1" :imgPath="http://gzf.test.nercel.cn/workshop/api/sourceHandle/getPicSource/"></editor>
  </div>
</template>
<script>
export default {
  components: {
    editor: () => import('@/components/tinymce')
  },
  data() {
    return {
      remark: 'asdfasdfasdf'
    }
  }
}
</script>
