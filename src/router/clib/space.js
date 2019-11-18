const spaceRouter = [
  {
    path: '/space/index',
    component: () => import('@/views-clib/space/index'),
    name: 'space',
    meta: {
      title: '空间管理',
      code: 'space'
    }
  },
  {
    path: '/space/add',
    component: () => import('@/views-clib/space/form'),
    name: 'space_add',
    meta: {
      title: '新增空间',
      code: 'space'
    }
  },
  {
    path: '/space/edit/:id',
    component: () => import('@/views-clib/space/form'),
    name: 'space_edit',
    meta: {
      title: '编辑空间',
      code: 'space'
    }
  },
  {
    path: '/space/detail/:id',
    component: () => import('@/views-clib/space/detail.vue'),
    name: 'space_detail',
    meta: {
      title: '查看空间',
      code: 'space'
    }
  },
  {
    path: '/space/setting/:id',
    component: () => import('@/views-clib/space/setting'),
    name: 'space_setting',
    meta: {
      title: '设置空间',
      code: 'space'
    }
  },
  {
    path: '/space/allocation',
    component: () => import('@/views-clib/space/allocation.vue'),
    name: 'space_allocation',
    meta: {
      title: '空间设施',
      code: 'space_allocation'
    }
  },
  {
    path: '/space/facilities',
    component: () => import('@/views-clib/space/facilities.vue'),
    name: 'space_facilities',
    meta: {
      title: '应用分配',
      code: 'space_facilities'
    }
  },
  {
    path: '/space/recycle',
    component: () => import('@/views-clib/space/children/recycle'),
    name: 'space_recycle',
    meta: {
      title: '空间回收站',
      code: 'space_recycle'
    }
  },
  {
    path: '/orderSpace/order',
    component: () => import('@/views-clib/space/children/order'),
    name: 'space_order',
    meta: {
      title: '订单管理',
      code: 'space_order'
    }
  },
  {
    path: '/orderSpace/setup',
    component: () => import('@/views-clib/space/children/order-setup'),
    name: 'space_order_setup',
    meta: {
      title: '预约设置',
      code: 'space_order_setup'
    }
  },
  {
    path: '/spaceOrder/setup/rec-time/:id',
    component: () => import('@/views-clib/space/children/rec-time.vue'),
    name: 'space_setup_rec-time',
    meta: {
      title: '推荐时段',
      code: 'space_order_setup'
    }
  },
  {
    path: '/spaceOrder/setup/unified',
    component: () => import('@/views-clib/space/children/unified-setup.vue'),
    name: 'space_unified_setup',
    meta: {
      title: '统一设置',
      code: 'space_order_setup'
    }
  },
  {
    path: '/spaceOrder/setup/duration',
    component: () => import('@/views-clib/space/children/duration-setup.vue'),
    name: 'space_duration_setup',
    meta: {
      title: '时长设置',
      code: 'space_order_setup'
    }
  },
  {
    path: '/spaceOrder/setup/scene',
    component: () => import('@/views-clib/space/children/scene-setup.vue'),
    name: 'space_scene_setup',
    meta: {
      title: '场次设置',
      code: 'space_order_setup'
    }
  }
];

export default spaceRouter;
