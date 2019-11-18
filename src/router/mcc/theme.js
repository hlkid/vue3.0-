// 主题管理
const themeRouter = [
  {
    path: '/theme',
    component: () => import('@/views-mcc/theme'),
    name: 'theme',
    meta: {
      title: '主题管理',
      code: 'white'
    }
  }, {
    path: '/theme/add',
    component: () => import('@/views-mcc/theme/form.vue'),
    name: 'theme_add',
    meta: {
      title: '新增主题',
      code: 'theme'
    }
  }, {
    path: '/theme/edit/:id',
    component: () => import('@/views-mcc/theme/form.vue'),
    name: 'theme_edit',
    meta: {
      title: '编辑主题',
      code: 'theme'
    }
  }, {
    path: '/theme/detail/:id',
    component: () => import('@/views-mcc/theme/detail.vue'),
    name: 'theme_detail',
    meta: {
      title: '查看主题',
      code: 'theme'
    }
  }
]

export default themeRouter
