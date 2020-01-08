// 模块管理
import MixinLayout from '@/views/layouts/MixinLayout'
const activityRouter = {
  path: '/activity/:workshopId',
  component: MixinLayout,
  redirect: '/activity/:workshopId/activityAdd',
  name: 'activity',
  meta: { title: '活动', icon: 'activity', noCache: true },
  children: [
    {
      path: 'activityInfo',
      component: () => import('@/views/activity/activityInfo'),
      name: 'activityInfo',
      meta: { title: '活动信息', icon: 'activity-info', requireAuth: true }
    },
    {
      path: 'activityList',
      component: () => import('@/views/activity/activityList'),
      name: 'activityList',
      meta: { title: '活动列表', icon: 'activity-list', requireAuth: true }
    },
    {
      path: 'activityShow/:activityId',
      component: () => import('@/views/activity/activityShow'),
      name: 'activityShow',
      meta: { title: '活动详情', icon: 'activity-show', requireAuth: true }
    },
    {
      path: 'activityAdd',
      component: () => import('@/views/activity/activityAdd'),
      name: 'activityAdd',
      meta: { title: '活动添加', icon: 'activity-add', requireAuth: true }
    },
    {
      path: 'activityEdit',
      component: () =>
      import('@/views/activity/activityEdit'),
      name: 'activityEdit',
      meta: { title: '活动修改', icon: 'activity-edit', requireAuth: true }
    },
    {
      path: 'activityMember',
      component: () =>
      import('@/views/activity/activityMember'),
      name: 'activityMember',
      meta: { title: '活动成员', icon: 'activity-member', requireAuth: true }
    }
  ]
}

export default activityRouter
