// 作品管理
const worksRouter = [
  {
    path: '/works',
    component: () => import('@/views-mcc/works'),
    name: 'works',
    meta: {
      title: '作品管理',
      code: 'works'
    }
  }
]

export default worksRouter
