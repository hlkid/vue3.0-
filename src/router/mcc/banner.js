// banner管理
const bannerRouter = [
  {
    path: '/banner',
    component: () => import('@/views-mcc/banner'),
    name: 'banner',
    meta: {
      title: 'banner管理',
      code: 'banner'
    }
  }
]

export default bannerRouter
