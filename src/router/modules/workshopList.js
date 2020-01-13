import BasicLayout from '@/views/layouts/BasicLayout'

const workshopList = {
  path: '/',
  component: BasicLayout,
  redirect: '/workshopHome',
  name: 'workshopList',
  meta: { title: '首页', icon: 'workshopList', noCache: true },
  children: [
    {
      path: 'workshopHome', component: () => import('@/views/workshopList/workshopHome'), name: 'home', meta: { title: '首页', icon: '' }},
    {
      path: 'workshopteacher', component: () => import('@/views/workshopList/workshopteacher'), name: 'teacher', meta: { title: '名师工作室', icon: '' }},
    {
      path: 'workshopNotice', component: () => import('@/views/workshopList/workshopNotice'), name: 'notice', meta: { title: '公告', icon: '' }},
    {
      path: 'workshopInformation', component: () => import('@/views/workshopList/workshopInformation'), name: 'information', meta: { title: '资讯', icon: '' }}
  ]
}
export default workshopList
