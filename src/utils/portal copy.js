// 网站入口js
import router from '@/router'
import locals from '@/utils/storage/locals'
import store from '@/store'
// import { Message } from 'element-ui'
import { getToken } from '@/utils/storage/cookies'
// import { windowSys } from './jquery/jquery'
import { getMobile } from './browser/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import * as appConfig from '../../static/appConfig'

const jumpToken = window.location.search.split('=')[1]
store.commit('SET_TOKEN', jumpToken)

NProgress.configure({ showSpinner: false })// NProgress Configuration

// if (!window.sys) {
//   windowSys()
// }

if (!locals.getItem('appConfig') || locals.getItem('appConfig') !== appConfig) {
  store.dispatch('SetAppConfig', appConfig).then(() => {
    console.log('前端基本设置:', store.getters.appConfig)
  })
}

if (store.getters.sysBasicConfig === '') {
  store.dispatch('getSysConfig', { groupid: 1 }).then(() => {
    console.log('系统全局基本设置:', store.getters.sysBasicConfig)
  })
}
console.log(store.getters, '----------')
if (store.getters.isMobile === '') {
  // var browserInfo = getMobileBrowser()
  // store.dispatch('SetBrowserInfo', browserInfo)
  store.dispatch('SetIsMobile', getMobile())
}
router.beforeEach(async(to, from, next) => {
  console.log(to, 'to')
  NProgress.start() // start progress bar
  if (store.getters.uuid) {
  }
  if (jumpToken || getToken()) {
    console.log(to, 1111111111)
    if (to.path === '/workshopHome') {
      next({ path: '/workshopHome' })
      NProgress.done()
    } else {
      console.log(333333333333)
      console.log(store.getters.userRoles)
      if (store.getters.userRoles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // await store.dispatch('getUserInfo').then(res => { // 拉取user_info
        //   console.log(res, 'res==4')
        //   store.dispatch('getUserRolePower', res.data.result.userId).then(() => {
        //   })
        //   next()
        // }).catch(() => {
        //   store.dispatch('FedLogOut').then(() => {
        //     Message.error('Verification failed, please login again')
        //     next({ path: '/WorkshopHome' })
        //   })
        // })
        next({ path: '/WorkshopHome' })
      } else {
        next()
      }
    }
  } else {
    console.log(to.meta, 22222222)
    if (to.meta.requireAuth) {
      next({
        path: '/workshopHome'
      }) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    } else {
      next()
      NProgress.done()
    }
  }
})
router.afterEach((to, from, next) => {
  store.dispatch('SetCurrentRoute', to.name)
  // console.log(store.getters.appConfig)
  // var webTitle = to.meta.title || store.getters.appConfig.cfg_webname
  // var webKeywords = to.meta.keywords || store.getters.appConfig.cfg_keywords
  // var webDesc = to.meta.description || store.getters.appConfig.cfg_description
  // if (to.path.indexOf('index') > -1) {
  //   webTitle = store.getters.appConfig.cfg_webname
  //   webKeywords = store.getters.appConfig.cfg_keywords
  //   webDesc = store.getters.appConfig.cfg_description
  // }
  // document.title = webTitle
  // document.querySelector('meta[name='keywords']').setAttribute('content', webKeywords)
  // document.querySelector('meta[name='description']').setAttribute('content', webDesc)
  NProgress.done() // finish progress bar
})
