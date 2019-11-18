const recruitmentRouter = [
  {
    path: '/volunteer/recruitment',
    component: () => import('@/views-volunteer/recruitment/recruitment'),
    name: 'recruitment',
    meta: {
      title: '活动招募管理',
      code: 'volunteer_recruitment',
      // code: 'volunteer_volunteer',
    }
  },
  {
    path: '/volunteer/recruitment/detail',
    component: () => import('@/views-volunteer/recruitment/form'),
    name: 'volunteer_recruitment_form',
    meta: {
      title: '活动招募管理添加',
      code: 'volunteer_recruitment',
      keepAlive:false
    }
  },
  {
    path: '/volunteer/recruitment/detail/:id',
    component: () => import('@/views-volunteer/recruitment/form'),
    name: 'volunteer_recruitment_edit',
    meta: {
      title: '活动招募管理修改',
      code: 'volunteer_recruitment',
      keepAlive:false
    }
  },
  {
    path: '/volunteer/recruitment/detail/:id',
    component: () => import('@/views-volunteer/recruitment/form'),
    name: 'volunteer_recruitment_detail',
    meta: {
      title: '活动招募管理详情',
      code: 'volunteer_recruitment',
      keepAlive:false
    }
  },
];

export default recruitmentRouter;
  