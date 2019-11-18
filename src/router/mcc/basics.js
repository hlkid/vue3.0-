const basicsRouter = [
  {
    path: '/basics/venue',
    component: () => import('@/views-mcc/basics/venue'),
    name: 'basics_venue',
    meta: {
      title: '场馆管理',
      code: 'basics_venue'
    }
  },
  {
    path: '/basics/venue/add',
    component: () => import('@/views-mcc/basics/venue/form.vue'),
    name: 'basics_venue_add',
    meta: {
      title: '场馆添加',
      code: 'basics_venue'
    }
  },
  {
    path: '/basics/venue/edit/:id',
    component: () => import('@/views-mcc/basics/venue/form.vue'),
    name: 'basics_venue_edit',
    meta: {
      title: '场馆修改',
      code: 'basics_venue'
    }
  },
  {
    path: '/basics/account',
    component: () => import('@/views-mcc/basics/account'),
    name: 'basics_account',
    meta: {
      title: '账号管理',
      code: 'basics_account'
    }
  },
];

export default basicsRouter;
