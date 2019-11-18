const volunteerRouter = [
  {
    path: '/volunteer/volunteer',
    component: () => import('@/views-volunteer/volunteer/volunteer'),
    name: 'volunteer',
    meta: {
      title: '志愿者管理',
      code: 'white',
      // code: 'volunteer_volunteer',
    }
  },
  {
    path: '/volunteer/volunteer/:id',
    component: () => import('@/views-volunteer/volunteer/volunteer/form'),
    name: 'volunteer_form',
    meta: {
      title: '志愿者修改',
      code: 'volunteer_volunteer',
    }
  },
  {
    path: '/volunteer/volunteer/:id',
    component: () => import('@/views-volunteer/volunteer/volunteer/form'),
    name: 'volunteer_detail',
    meta: {
      title: '志愿者详情',
      code: 'volunteer_volunteer',
    }
  },
  {
    path: '/volunteer/config/dictionary',
    component: () => import('@/views-volunteer/dictionary'),
    name: 'volunteer_dictionary',
    meta: {
      title: '数据词典',
      code: 'volunteer_config_dictionary',
      keepAlive:false
    }
  },
  {
    path: '/volunteer/starManger',
    component: () => import('@/views-volunteer/starManger'),
    name: 'volunteer_starManger',
    meta: {
      title: '志愿者之星管理',
      code: 'volunteer_starManger',
      keepAlive:false
    }
  },
  {
    path: '/volunteer/activeManger',
    component: () => import('@/views-volunteer/activeManger'),
    name: 'volunteer_activeManger',
    meta: {
      title: '活动报名管理',
      code: 'volunteer_activeManger',
      keepAlive:false
    }
  }
];

export default volunteerRouter;
