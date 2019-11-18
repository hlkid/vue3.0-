// 艺术鉴赏
const appreciativeRouter = [
  {
    path: '/appreciative/:typeCode/:type',
    component: () => import('@/views-mcc/appreciative/art'),
    name: 'appreciative_exhibition',
    meta: {
      title: '展览展示',
      code: 'appreciative_exhibition'
    }
  },
  {
    path: '/appreciative/:typeCode/:type',
    component: () => import('@/views-mcc/appreciative/art'),
    name: 'appreciative_art',
    meta: {
      title: '艺术鉴赏',
      code: 'appreciative_art'
    }
  },
  {
    path: '/appreciative/:typeCode/:type/form',
    component: () => import('@/views-mcc/appreciative/art/form.vue'),
    name: 'appreciative',
    meta: {
      title: '表单',
      code: 'appreciative'
    }
  },
  {
    path: '/appreciative/:typeCode/:type/detail',
    component: () => import('@/views-mcc/appreciative/art/detail.vue'),
    name: 'appreciative_view',
    meta: {
      title: '详情',
      code: 'appreciative'
    }
  },
  // 景点游览
  {
    path: '/appreciative/scenicspot',
    component: () => import('@/views-mcc/appreciative/scenicspot'),
    name: 'appreciative_scenicspot',
    meta: {
      title: '景点游览',
      code: 'appreciative_scenicspot'
    }
  },
  {
    path: '/appreciative/scenicspot/form',
    component: () => import('@/views-mcc/appreciative/scenicspot/form.vue'),
    name: 'scenicspot_form',
    meta: {
      title: '表单',
      code: 'appreciative_scenicspot'
    }
  },
  {
    path: '/appreciative/scenicspot/detail',
    component: () => import('@/views-mcc/appreciative/scenicspot/detail.vue'),
    name: 'scenicspot_view',
    meta: {
      title: '详情',
      code: 'appreciative_scenicspot'
    }
  }
]

export default appreciativeRouter
