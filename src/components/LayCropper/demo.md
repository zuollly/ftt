<template>
  <div>
    <img :src="imgUrl"/>
    <lay-cropper
      :cropWidth="140"
      :cropHeight="140"
      @cropped="showMsgFromChild"></lay-cropper>
  </div>
</template>
<script>

export default {
  components: {
    LayCropper: () => import('@/components/LayCropper')
  },
  data() {
    return {
      imgUrl: 'http://gzf.test.nercel.cn/workshop/api/sourceHandle/getPicSource/1546068059099.png'
    }
  },
  methods: {
    showMsgFromChild: function(data) {
      this.imgUrl = data.file
      console.log(data.result)
    }
  }
}
</script>
