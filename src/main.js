// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import promise from 'es6-promise'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/sass/example.scss'
import { LoadedHandler } from '@/utils/resizeImage/ImgParentSize'

import '@/utils/portal'
import '@/utils/svgIcon'

import * as filters from '@/utils/filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueLazyload, {
  lazyComponent: true,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: ['resize'],
  adapter: {
    loaded({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init }) {
      console.log(el.getAttribute('lazy'))
      if (el.getAttribute('lazy') !== 'error') {
        if (naturalHeight) {
          if (el.parentNode.getAttribute('data-id') === 'pic') {
            var parentWidth = el.parentNode.clientWidth
            var parentHeight = el.parentNode.clientHeight
            LoadedHandler(el, naturalHeight, naturalWidth, parentHeight, parentWidth)
          }
        }
      }
    },
    loading(el, listender, Init) {
      // console.log('loading')
      // console.log(el.el)
      // el.setAttribute('style', 'position: absolute; top:' + -o.off_t + 'px;left:' + -o.off_l + 'px; width:' + n.w + 'px;height:' + n.h + 'px;')
    },
    error(listender, Init) {
      // console.log('error')
    }
  }
})

Vue.config.productionTip = false

Vue.use(ElementUI)
/* eslint-disable no-new */
promise.polyfill()

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
