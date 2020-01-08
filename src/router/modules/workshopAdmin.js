import MainLayout from '@/views/layouts/MainLayout'

const workshopAdmin = {
  path: '/workshopAdmin',
  component: MainLayout,
  redirect: '/workshopAdmin/WorkshopAdd',
  name: 'workshopAdmin',
  hidden: true,
  meta: { title: '工作坊管理', icon: 'workshopAdmin', noCache: true },
  children: [
    {
      path: 'workshopAdd',
      component: () => import('@/views/workshops/WorkshopAdd'),
      name: 'workshopAdd',
      meta: {
        title: '添加工作坊', icon: '', requireAuth: true, roles: ['admin']
      }
    },
    {
      path: 'workshopAdminEdit/:id',
      component: () => import('@/views/workshops/WorkshopEdit'),
      name: 'workshopAdminEdit',
      meta: { title: '修改工作坊', icon: '', requireAuth: true, roles: ['admin'], workshopRoles: [0, 1, 6]
      }
    }
  ]
}
export default workshopAdmin
