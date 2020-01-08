<template>
  <div :class="containerName">
    <slot name="container"></slot>
  </div>
</template>

<script>
import { getMobile } from '@/utils/browser/index'
export default {
  name: 'LayContainerQuery',
  data() {
    return {
      containerName: [],
      screenWidth: document.documentElement.clientWidth,
      screenHeight: document.documentElement.clientHeight,
      query: {
        'screen-xs': {
          maxWidth: 575
        },
        'screen-sm': {
          minWidth: 576,
          maxWidth: 767
        },
        'screen-md': {
          minWidth: 768,
          maxWidth: 991
        },
        'screen-lg': {
          minWidth: 992,
          maxWidth: 1199
        },
        'screen-xl': {
          minWidth: 1200,
          maxWidth: 1599
        },
        'screen-xxl': {
          minWidth: 1600
        }
      }
    }
  },
  watch: {
    screenHeight: function(val) {
      var _this = this
      if (!this.timer) {
        _this.screenHeight = val
        _this.timer = true
        setTimeout(function() {
          _this.timer = false
        }, 400)
      }
    },
    screenWidth: function(val) {
      var _this = this
      if (!this.timer) {
        _this.screenHeight = val
        this.containerQuery()
        _this.timer = true
        setTimeout(function() {
          _this.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    const _this = this
    _this.containerQuery()
    // window.addEventListener("resize", function() {
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.documentElement.clientWidth
        window.screenHeight = document.documentElement.clientHeight
        _this.screenWidth = window.screenWidth
        _this.screenHeight = window.screenHeight
        this.containerQuery()
      })()
    }
  },
  methods: {
    containerQuery: function() {
      var containerNames = ''
      if (this.screenWidth <= this.query['screen-xs'].maxWidth) { containerNames = 'screen-xs' }
      if (this.screenWidth >= this.query['screen-sm'].minWidth && this.screenWidth <= this.query['screen-sm'].maxWidth) { containerNames = 'screen-sm' }
      if (this.screenWidth >= this.query['screen-md'].minWidth && this.screenWidth <= this.query['screen-md'].maxWidth) { containerNames = 'screen-md' }
      if (this.screenWidth >= this.query['screen-lg'].minWidth && this.screenWidth <= this.query['screen-lg'].maxWidth) { containerNames = 'screen-lg' }
      if (this.screenWidth >= this.query['screen-xl'].minWidth && this.screenWidth <= this.query['screen-xl'].maxWidth) { containerNames = 'screen-xl' }
      if (this.screenWidth >= this.query['screen-xxl'].minWidth) { containerNames = 'screen-xxl' }
      this.$store.dispatch('SetContainerName', containerNames)
      document.getElementsByTagName('body')[0].setAttribute('class', containerNames)
      this.$store.dispatch('SetIsMobile', getMobile())
      this.containerName = [containerNames]
    }
  }
}
</script>
