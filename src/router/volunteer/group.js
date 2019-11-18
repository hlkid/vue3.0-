const groupRouter = [
  {
    path: '/volunteer/group/org',
    component: () => import('@/views-volunteer/group/org'),
    name: 'volunteer_group',
    meta: {
      title: '团队管理',
      code: 'volunteer_group_org',
      // keepAlive:false
    }
  },
  {
    path: '/volunteer/group/detail',
    component: () => import('@/views-volunteer/group/org/form'),
    name: 'volunteer_group_form',
    meta: {
      title: '团队添加',
      code: 'volunteer_group_org',
      keepAlive:false
    }
  },
  {
    path: '/volunteer/group/detail/:id',
    component: () => import('@/views-volunteer/group/org/form'),
    name: 'volunteer_group_edit',
    meta: {
      title: '团队修改',
      code: 'volunteer_group_org',
      keepAlive:false
    }
  },
  {
    path: '/volunteer/group/detail/:id',
    component: () => import('@/views-volunteer/group/org/form'),
    name: 'volunteer_group_detail',
    meta: {
      title: '团队详情',
      code: 'volunteer_group_org',
      keepAlive:false
    }
  },
];

export default groupRouter;
