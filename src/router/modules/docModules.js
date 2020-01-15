// 模块管理
import MixinLayout from '@/views/layouts/MixinLayout'
// 资源管理
const docModules = {
  path: '/doc',
  component: MixinLayout,
  redirect: '/doc/docShow',
  name: 'doc',
  meta: { title: '资源', icon: 'doc', noCache: true },
  children: [
    {
      path: 'docShow/:id', component: () => import('@/views/homeDoc/docShow'), name: 'docShow', meta: { title: '资源预览' }
    },
    {
      path: 'activityShow/:activityId', component: () => import('@/views/homeDoc/activityShow'), name: 'homeActivityShow', meta: { title: '活动详情', icon: 'activity-show' }
    },
    {
      path: 'noticeShow/:id', component: () => import('@/views/notice/noticeShow'), name: 'noticeShow', hidden: true, meta: { title: '内容详情', icon: '' }
    }
  ]
}

export default docModules
