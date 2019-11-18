const configRouter = [
  {
    path: '/config/resource',
    component: () => import(/* webpackChunkName: "resource" */ '@/views-common/config/resource'),
    name: 'resource',
    meta: {
      title: '资源管理',
      code: 'config_resource'
    }
  },
  {
    path: '/config/resource/add',
    component: () => import(/* webpackChunkName: "resource_add" */ '@/views-common/config/resource'),
    name: 'resource_add',
    meta: {
      title: '资源添加',
      code: 'config_resource'
    }
  },
  {
    path: '/config/role',
    component: () => import('@/views-common/config/role'),
    name: 'role',
    meta: {
      title: '角色管理',
      code: 'config_role'
    }
  },
  {
    path: '/config/user',
    component: () => import('@/views-common/config/user'),
    name: 'user',
    meta: {
      title: '用户管理',
      code: 'config_user'
    }
  },
  {
    path: '/config/dictionary',
    component: () => import('@/views-common/config/dictionary'),
    name: 'dictionary',
    meta: {
      title: '数据词典',
      code: 'config_dictionary'
    }
  },
  {
    path: '/config/application',
    component: () => import('@/views-common/config/application'),
    name: 'application',
    meta: {
      title: '应用管理',
      code: 'config_application'
    }
  },
  {
    path: '/config/group',
    component: () => import('@/views-common/config/group'),
    name: 'config_group',
    meta: {
      title: '分组管理',
      code: 'config_group'
    }
  },
  {
    path: '/config/appicon',
    component: () => import('@/views-common/config/appicon'),
    name: 'appicon',
    meta: {
      title: '应用管理',
      code: 'config_appicon'
    }
  }
];

export default configRouter;
