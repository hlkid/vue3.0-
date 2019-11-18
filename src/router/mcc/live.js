const liveRouter = [
  {
    path: '/live',
    component: () => import('@/views-mcc/live/index.vue'),
    name: 'live',
    meta: {
      title: '直播管理',
      code: 'live'
    }
  }, {
    path: '/live/add',
    component: () => import('@/views-mcc/live/form.vue'),
    name: 'live_add',
    meta: {
      title: '新增直播',
      code: 'live'
    }
  }, {
    path: '/live/edit/:id',
    component: () => import('@/views-mcc/live/form.vue'),
    name: 'live_edit',
    meta: {
      title: '编辑直播',
      code: 'live'
    }
  }, {
    path: '/live/detail/:id',
    component: () => import('@/views-mcc/live/detail.vue'),
    name: 'live_detail',
    meta: {
      title: '直播详情',
      code: 'live'
    }
  }, {
    path: '/live/upload',
    component: () => import('@/views-mcc/live/upload.vue'),
    name: 'live_upload',
    meta: {
      title: '资源视频',
      code: 'live'
    }
  }
]
export default liveRouter
