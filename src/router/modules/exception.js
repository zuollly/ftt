import UserLayout from '@/views/layouts/UserLayout'

const exceptionRouter = {
  path: '/exception',
  component: UserLayout,
  redirect: '/exception/403',
  name: 'exception',
  meta: { title: '异常页', icon: 'warning', noCache: true },
  children: [
    {
      path: '403', component: () => import('@/views/exception/403'), name: '403', meta: { title: '403', icon: '' }},
    {
      path: '404', component: () => import('@/views/exception/404'), name: '404', meta: { title: '404', icon: '' }},
    {
      path: '500', component: () => import('@/views/exception/500'), name: '500', meta: { title: '500', icon: '' }}
  ]
}

export default exceptionRouter
