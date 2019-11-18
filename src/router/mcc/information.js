// 资讯管理
const informationRouter = [
  {
    path: '/information/:typeCode/:type',
    component: () => import('@/views-mcc/information'),
    name: 'information',
    meta: {
      title: '资讯管理',
      code: 'information'
    }
  },
  {
    path: '/information/:typeCode/:type/form/:id?',
    component: () => import('@/views-mcc/information/form'),
    name: 'information_form',
    meta: {
      title: '表单',
      code: 'information'
    }
  },
  {
    path: '/information/:typeCode/:type/detail/:id',
    component: () => import('@/views-mcc/information/detail'),
    name: 'information_view',
    meta: {
      title: '详情',
      code: 'information'
    }
  }
  // ---------------------新闻公告 end-----------------
]

export default informationRouter
