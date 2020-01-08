<template>
  <div class="mr-auto ml-auto mt-3 mb-3 lay-data-not">
    <template v-if="gridType == 'lr'">
      <div class="d-flex bd-highlight justify-content-center">
        <div class="p-2">
          <img :src="photo" :style="getImgStyle"/>
        </div>
        <div class="p-2 align-self-center">
          <div v-html="textDisc" class="text-center text-light-gray"></div>
        </div>
      </div>
    </template>
    <template v-if="gridType == 'tb'">
        <div class="text-center"><img :src="photo" :style="getImgStyle"/></div>
        <div v-html="textDisc" class="text-center text-light-gray mt-3"></div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    imgHeigth: {
      type: Number,
      default: 120
    },
    photo: {
      type: String,
      default: './static/images/dataNot.svg'
    },
    textDisc: {
      type: String,
      default: '暂无数据'
    },
    gridType: {
      type: String,
      default: 'tb' // tb 上下结构 lr 左右结构
    }
  },
  computed: {
    getImgStyle: function() {
      return { height: this.imgHeigth + 'px' }
    }
  }
}
</script>
