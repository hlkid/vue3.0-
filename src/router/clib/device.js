const deviceRouter = [
  {
    path: '/device/door',
    component: () => import('@/views-clib/device/door/index.vue'),
    name: 'device-door',
    meta: {
      title: '门禁设备管理',
      code: 'device_door_index'
    }
  },{
    path: '/device/door/add',
    component: () => import('@/views-clib/device/door/form.vue'),
    name: 'device-door-add',
    meta: {
      title: '新增',
      code:'device_door_index'
    }
  },{
    path: '/device/door/edit/:id',
    component: () => import('@/views-clib/device/door/form.vue'),
    name: 'device-door-edit',
    meta: {
      title: '修改',
      code:'device_door_index'
    }
  },{
    path: '/device/door/detail/:id',
    component: () => import('@/views-clib/device/door/detail.vue'),
    name: 'device-door-detail',
    meta: {
      title: '详情',
      code:'device_door_index'
    }
  },{
    path: '/device/door/setup/:id',
    component: () => import('@/views-clib/device/door/setup.vue'),
    name: 'device_door_setup',
    meta: {
      title: '设置',
      code:'device_door_index'
    }
  },{
    path: '/device/door/setup-card/:id',
    component: () => import('@/views-clib/device/door/authority-card.vue'),
    name: 'device-door-setup-card',
    meta: {
      title: '授权卡',
      code:'device_door_index'
    }
  },

  {
    path: '/device/seat',
    component: () => import('@/views-clib/device/seat/index.vue'),
    name: 'device-seat',
    meta: {
      title: '座位设备管理',
      code:'device-seat_index'
    }
  },{
    path: '/device/seat/add',
    component: () => import('@/views-clib/device/seat/form.vue'),
    name: 'device-seat_add',
    meta: {
      title: '新增',
      code:'device-seat_index'
    }
  },{
    path: '/device/seat/edit/:id',
    component: () => import('@/views-clib/device/seat/form.vue'),
    name: 'device-seat_edit',
    meta: {
      title: '修改',
      code:'device-seat_index'
    }
  },{
    path: '/device/seat/detail/:id',
    component: () => import('@/views-clib/device/seat/detail.vue'),
    name: 'device-seat_detail',
    meta: {
      title: '详情',
      code:'device-seat_index'
    }
  },{
    path: '/device/seat/setup/:id',
    component: () => import('@/views-clib/device/seat/setup.vue'),
    name: 'device-seat_setup',
    meta: {
      title: '设置',
      code:'device-seat_index'
    }
  },
  {
    path: '/device/seat/bind-lamp/:id',
    component: () => import('@/views-clib/device/seat/bind-lamp.vue'),
    name: 'device-seat_bind-lamp',
    meta: {
      title: '查看智能灯',
      code:'device-seat_index'
    }
  },

  {
    path: '/device/IDCard',
    component: () => import('@/views-clib/device/IDCard/index.vue'),
    name: 'device-IDCard',
    meta: {
      title: 'ID卡管理',
      code:'device-id-card'
    }
  },
  {
    path: '/device/IDCard/:id',
    component: () => import('@/views-clib/device/IDCard/auto.vue'),
    name: 'device-IDCard_auto',
    meta: {
      title: '授权',
      code:'device-id-card'
    }
  },
  {
    path: '/device/lamp',
    component: () => import('@/views-clib/device/lamp/index.vue'),
    name: 'device-lamp',
    meta: {
      title: '智能灯ID',
      code:'device_lamp'
    }
  },
  {
    path: '/device/record-door',
    component: () => import('@/views-clib/device/door-record/index.vue'),
    name: 'device-door_record',
    meta: {
      title: '门禁记录管理',
      code:'device_seat-record'
    }
  },
  {
    path: '/device/record-seat',
    component: () => import('@/views-clib/device/seat-record/index.vue'),
    name: 'device-seat_record',
    meta: {
      title: '座位记录管理',
      code:'device_seat-record'
    }
  }

]

export default deviceRouter
