import MainLayout from '@/views/layouts/MainLayout'

const workshopRouter = {
  path: '/workshops/:id',
  component: MainLayout,
  redirect: '/workshops/:id/Workshop',
  name: 'workshops',
  meta: { title: '当前工作坊首页', icon: 'workshops', noCache: true },
  children: [
    {
      path: 'workshop', component: () => import('@/views/workshops/workshop'), name: 'workshop', meta: { title: '首页', icon: '', requireAuth: true }},
    {
      path: 'noticeList', component: () => import('@/views/notice/noticeList'), name: 'noticeList', meta: { title: '公告', icon: '', requireAuth: true }},
    {
      path: 'informationList', component: () => import('@/views/information/informationList'), name: 'informationList', meta: { title: '资讯', icon: '', requireAuth: true }},
    {
      path: 'lectureroomList', component: () => import('@/views/lectureroom/lectureroomList'), name: 'lectureroomList', meta: { title: '名师讲堂列表', icon: '', requireAuth: true }},
    {
      path: 'resourceList', component: () => import('@/views/resource/resourceList'), name: 'resourceList', meta: { title: '教学资源', icon: '', requireAuth: true }},
    {
      path: 'memberList', component: () => import('@/views/member/memberList'), name: 'memberList', meta: { title: '工作室成员', icon: '', requireAuth: true }},
    // {
    //   path: 'ActivityList', component: () => import('@/views/activity/activityList'), name: 'activityList', meta: { title: '工作室活动', icon: '' }},

    {
      path: '/workshops/:id/activity',
      component: () => import('@/views/activity/index'),
      name: 'activity',
      redirect: '/workshops/:id/activity/activityList',
      meta: { title: '工作室活动', icon: '', requireAuth: true },
      children: [
        {
          path: 'activityList', component: () => import('@/views/activity/activityList'), name: 'activityList', hidden: true, meta: { title: '工作室活动', icon: '' }},
        {
          path: 'activityAdd', component: () => import('@/views/activity/activityAdd'), name: 'activityAdd', hidden: true, meta: { title: '活动添加', icon: 'activity-add', requireAuth: true }
        },
        {
          path: 'activityEdit', component: () => import('@/views/activity/activityEdit'), name: 'activityEdit', hidden: true, meta: { title: '活动修改', icon: 'activity-edit', requireAuth: true }
        },
        {
          path: 'activityInfo', component: () => import('@/views/activity/activityInfo'), name: 'activityInfo', hidden: true, meta: { title: '活动信息', icon: 'activity-info', requireAuth: true }
        },
        { path: 'activityShow/:activityId', component: () => import('@/views/activity/activityShow'), name: 'activityShow', hidden: true, meta: { title: '活动详情', icon: 'activity-show', requireAuth: true }
        }
      ]
    },

    {
      path: 'achievementList', component: () => import('@/views/achievement/achievementList'), name: 'achievement', meta: { title: '成果展示', icon: '', requireAuth: true }},
    {
      path: '/workshops/:id/teaching',
      component: () => import('@/views/teaching/index'),
      name: 'teaching',
      redirect: '/workshops/:id/teaching/teachingList',
      meta: { title: '互动教研', icon: '', requireAuth: true },
      children: [
        {
          path: 'teachingList', component: () => import('@/views/teaching/teachingList'), name: 'teachingList', hidden: true, meta: { title: '互动教研', icon: '', requireAuth: true }},
        {
          path: 'teachingAdd', component: () => import('@/views/teaching/teachingAdd'), name: 'teachingAdd', hidden: true, meta: { title: '互动教研添加', icon: 'activity-add', requireAuth: true }
        },
        {
          path: 'teachingShow/:activityId', component: () => import('@/views/teaching/teachingShow'), hidden: true, name: 'teachingShow', meta: { title: '活动详情', icon: 'activity-show', requireAuth: true }
        }
      ]
    },
    {
      path: 'workshopEdit',
      component: () => import('@/views/workshops/WorkshopEdit'),
      name: 'workshopEdit',
      hidden: true,
      meta: { title: '修改工作坊', icon: '', requireAuth: true, workshopRoles: [0, 1, 6]
      }
    }
  ]
}
export default workshopRouter
