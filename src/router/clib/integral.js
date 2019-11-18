const integralRouter = [
  {
    path: '/integral/index',
    component: () => import('@/views-clib/integral/index.vue'),
    name: 'integral',
    meta: {
      title: '积分规则',
      code: 'integral_index'
    }
  },{
    path: '/integral/index/:id',
    component: () => import('@/views-clib/integral/apply.vue'),
    name: 'integral_apply',
    meta: {
      title: '绑定应用',
      code: 'integral_index'
    }
  },{
    path: '/integral/record',
    component: () => import('@/views-clib/integral/record.vue'),
    name: 'integral_record',
    meta: {
      title: '积分记录',
      code: 'integral_record'
    }
  },
  {
    path: '/integral/apply-rule',
    component: () => import('@/views-clib/integral/apply-rule.vue'),
    name: 'integral_record',
    meta: {
      title: '应用规则',
      code: 'integral_apply-rule'
    }
  },
  {
    path: '/integral/apply-rule/integral-rule/:id',
    component: () => import('@/views-clib/integral/integral-rule.vue'),
    name: 'integral_rule',
    meta: {
      title: '积分规则',
      code: 'white'
    }
  },

]

export default integralRouter
