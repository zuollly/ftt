import Vue from 'vue'
import Router from 'vue-router'
import UserLayout from '@/views/layouts/UserLayout'
// import formsRouter from './modules/forms'
// import listRouter from './modules/list'
// import profileRouter from './modules/profile'
// import resultRouter from './modules/result'
// import exceptionRouter from './modules/exception'
// import activityRouter from './modules/activity'
import workshopList from './modules/workshopList'
import workshopRouter from './modules/workshop'
// import accountRouter from './modules/account'
// formsRouter, listRouter, profileRouter, resultRouter, exceptionRouter, accountRouter,
// 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
// hidden: true // (默认 false)
// 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
// redirect: 'noredirect'

// 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
// alwaysShow: true

// name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题

// requireAuth // 当前路由是否需要登录

// meta: {
//   roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
//   title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
//   icon: 'svg-name' // 设置该路由的图标
//   noCache: true // 如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
// }

Vue.use(Router)

export const constantRouterMap = [
  workshopList, workshopRouter,
  {
    path: '/user',
    component: UserLayout,
    hidden: true,
    redirect: '/user/login',
    children: [
      { path: 'login', component: () => import('@/views/user/Login'), name: 'login', hidden: true },
      { path: 'register', component: () => import('@/views/user/Register'), name: 'register', hidden: true },
      { path: 'forget', component: () => import('@/views/user/Forget'), name: 'forget', hidden: true }
    ]
  },
  {
    path: '403', component: () => import('@/views/exception/403'), name: '403', meta: { title: '403', icon: '' }},
  {
    path: '404', component: () => import('@/views/exception/404'), name: '404', meta: { title: '404', icon: '' }},
  {
    path: '500', component: () => import('@/views/exception/500'), name: '500', meta: { title: '500', icon: '' }},
  { path: '/tokenLogin/:token', component: () => import('@/views/user/TokenLogin'), name: 'tokenLogin', hidden: true },
  // {
  //   path: '',
  //   hidden: true,
  //   component: () => import('@/views/layouts/BasicLayout'),
  //   redirect: '/home',
  //   meta: {
  //     title: '工作坊', icon: ''
  //   },
  //   children: [
  //     { path: 'home', component: () => import('@/views/workshopList/WorkshopAll') }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', // require service support
  routes: constantRouterMap
})
