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
      path: 'workshopteacher', component: () => import('@/views/workshopList/workshopteacher'), name: 'teacherHome', meta: { title: '名师工作室', icon: '' }},
    {
      path: 'workshopNotice', component: () => import('@/views/workshopList/workshopNotice'), name: 'noticeHome', meta: { title: '公告', icon: '' }},
    {
      path: 'workshopInformation', component: () => import('@/views/workshopList/workshopInformation'), name: 'informationHome', meta: { title: '资讯', icon: '' }},
    {
      path: 'workshopResource', component: () => import('@/views/workshopList/workshopResource'), name: 'resourceHome', meta: { title: '资源', icon: '' }
    },
    {
      path: 'workshopAchievement', component: () => import('@/views/workshopList/workshopAchievement'), name: 'achievementHome', meta: { title: '成果', icon: '' }
    },
    {
      path: 'workshopActivity', component: () => import('@/views/workshopList/workshopActivity'), name: 'workshopActivity', meta: { title: '活动', icon: '' }
    },
    {
      path: 'noticeShow/:id', component: () => import('@/views/notice/noticeShow'), name: 'noticeShow', hidden: true, meta: { title: '内容详情', icon: '' }
    }
  ]
}
export default workshopList
