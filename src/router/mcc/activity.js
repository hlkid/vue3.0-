// 活动管理
const activityRouter = [
  {
    path: '/activity',
    component: () => import('@/views-mcc/activity'),
    name: 'activity',
    meta: {
      title: '活动管理',
      code: 'activity'
    }
  }, {
    path: '/activity/add',
    component: () => import('@/views-mcc/activity/form.vue'),
    name: 'activity_add',
    meta: {
      title: '新增活动',
      code: 'activity'
    }
  }, {
    path: '/activity/edit/:id',
    component: () => import('@/views-mcc/activity/form.vue'),
    name: 'activity_edit',
    meta: {
      title: '编辑活动',
      code: 'activity'
    }
  }, {
    path: '/activity/detail/:id',
    component: () => import('@/views-mcc/activity/detail.vue'),
    name: 'activity_detail',
    meta: {
      title: '查看活动',
      code: 'activity'
    }
  }, {
    path: '/activity/upload/:id',
    component: () => import('@/views-mcc/activity/upload.vue'),
    name: 'activity_upload',
    meta: {
      title: '上传资源',
      code: 'activity'
    }
  },
  /*预约管理*/
  {
    path: '/activity/appointment',
    component: () => import('@/views-mcc/appointment'),
    name: 'appointment',
    meta: {
      title: '订单管理',
      code: 'white'
    }
  },
  {
    path: '/payment',
    component: () => import('@/views-mcc/payment'),
    name: 'payment',
    meta: {
      title: '付款管理',
      code: 'white'
    }
  },
]

export default activityRouter
