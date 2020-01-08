import BasicLayout from '@/views/layouts/BasicLayout'

const workshopList = {
  path: '/',
  component: BasicLayout,
  redirect: '/WorkshopHome',
  name: 'workshopList',
  meta: { title: '首页', icon: 'workshopList', noCache: true },
  children: [
    {
      path: 'WorkshopHome', component: () => import('@/views/workshopList/WorkshopHome'), name: 'home', meta: { title: '首页', icon: '' }},
    {
      path: 'Workshopteacher', component: () => import('@/views/workshopList/Workshopteacher'), name: 'teacher', meta: { title: '名师工作室', icon: '' }},
    {
      path: 'WorkshopNotice', component: () => import('@/views/workshopList/WorkshopNotice'), name: 'notice', meta: { title: '公告', icon: '' }},
    {
      path: 'WorkshopInformation', component: () => import('@/views/workshopList/WorkshopInformation'), name: 'information', meta: { title: '资讯', icon: '' }}
  ]
}
export default workshopList
