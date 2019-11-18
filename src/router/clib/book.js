const bookRouter = [
  {
    path: '/book/index',
    component: () => import('@/views-clib/book/good/index'),
    name: 'book',
    meta: {
      title: '图书管理',
      code: 'book_index'
    }
  },
  {
    path: '/book/form/:id',
    component: () => import('@/views-clib/book/good/children/form'),
    name: 'book_recommend',
    meta: {
      title: '好书推荐',
      code: 'book_index'
    }
  },
  {
    path: '/book/form/:type/:id',
    component: () => import('@/views-clib/book/good/children/form'),
    name: 'book_recommend_edit',
    meta: {
      title: '好书推荐',
      code: 'book_index'
    }
  },
  {
    path: '/book/new',
    component: () => import('@/views-clib/book/new/index'),
    name: 'book_new',
    meta: {
      title: '新书上架',
      code: 'book_new'
    }
  },
  {
    path: '/book/new/form/:id',
    component: () => import('@/views-clib/book/new/children/form'),
    name: 'book_new_edit',
    meta: {
      title: '图书管理',
      code: 'book_new'
    }
  },
  {
    path: '/book/new/form/:type/:id',
    component: () => import('@/views-clib/book/new/children/form'),
    name: 'book_new_look',
    meta: {
      title: '图书管理',
      code: 'book_new'
    }
  },
  {
    path: '/book/lib',
    component: () => import('@/views-clib/book/lib/index'),
    name: 'book_lib',
    meta: {
      title: '馆员推荐',
      code: 'book_lib'
    }
  },
  {
    path: '/book/lib/form/:id',
    component: () => import('@/views-clib/book/lib/children/form'),
    name: 'book_lib_edit',
    meta: {
      title: '图书管理',
      code: 'book_lib'
    }
  },
  {
    path: '/book/lib/form/:type/:id',
    component: () => import('@/views-clib/book/lib/children/form'),
    name: 'book_lib_look',
    meta: {
      title: '图书管理',
      code: 'book_lib'
    }
  },
  {
    path: '/book/rank',
    component: () => import('@/views-clib/book/rank/index'),
    name: 'book_rank',
    meta: {
      title: '图书排行',
      code: 'book_rank'
    }
  },
  {
    path: '/book/rank/form/:id',
    component: () => import('@/views-clib/book/rank/children/form'),
    name: 'book_rank_edit',
    meta: {
      title: '图书管理',
      code: 'book_rank'
    }
  },
  {
    path: '/book/rank/form/:type/:id',
    component: () => import('@/views-clib/book/rank/children/form'),
    name: 'book_rank_look',
    meta: {
      title: '图书管理',
      code: 'book_rank'
    }
  },
  {
    path: '/book/select',
    component: () => import('@/views-clib/book/selected/index'),
    name: 'book_select',
    meta: {
      title: '精选书单',
      code: 'book_select'
    }
  },
  {
    path: '/book/select/add',
    component: () => import('@/views-clib/book/selected/children/form'),
    name: 'book_select_add',
    meta: {
      title: '新增',
      code: 'book_select'
    }
  },
  {
    path: '/book/select/edit/:id',
    component: () => import('@/views-clib/book/selected/children/form'),
    name: 'book_select_edit',
    meta: {
      title: '编辑',
      code: 'book_select'
    }
  },
  {
    path: '/book/select/manage/:id',
    component: () => import('@/views-clib/book/selected/children/manage'),
    name: 'book_manage_edit',
    meta: {
      title: '图书管理',
      code: 'book_select'
    }
  },
  {
    path: '/book/select/manage/:type/:id',
    component: () => import('@/views-clib/book/selected/children/manage'),
    name: 'book_manage_look',
    meta: {
      title: '图书管理',
      code: 'book_select'
    }
  },
  {
    path: '/book/famous',
    component: () => import('@/views-clib/book/famous/index'),
    name: 'book_famous',
    meta: {
      title: '精选书单',
      code: 'book_famous'
    }
  },
  {
    path: '/book/famous/add',
    component: () => import('@/views-clib/book/famous/children/form'),
    name: 'book_famous_add',
    meta: {
      title: '新增',
      code: 'book_famous'
    }
  },
  {
    path: '/book/famous/edit/:id',
    component: () => import('@/views-clib/book/famous/children/form'),
    name: 'book_famous_edit',
    meta: {
      title: '编辑',
      code: 'book_famous'
    }
  },
  {
    path: '/book/famous/manage/:id',
    component: () => import('@/views-clib/book/famous/children/manage'),
    name: 'book_famous_manage_edit',
    meta: {
      title: '图书管理',
      code: 'book_famous'
    }
  },
  {
    path: '/book/famous/manage/:type/:id',
    component: () => import('@/views-clib/book/famous/children/manage'),
    name: 'book_famous_look',
    meta: {
      title: '图书管理',
      code: 'book_famous'
    }
  },
  {
    path: '/book/buy',
    component: () => import('@/views-clib/book/buy/index'),
    name: 'book_buy',
    meta: {
      title: '图书荐购',
      code: 'book_buy'
    }
  },
  {
    path: '/book/moudle',
    component: () => import('@/views-clib/book/moudle/index'),
    name: 'book_moudle',
    meta: {
      title: '栏目管理',
      code: 'book_moudle'
    }
  },
  {
    path: '/book/moudle/add',
    component: () => import('@/views-clib/book/moudle/children/form'),
    name: 'book_moudle_add',
    meta: {
      title: '新增栏目',
      code: 'book_moudle'
    }
  },
  {
    path: '/book/moudle/edit/:id',
    component: () => import('@/views-clib/book/moudle/children/form'),
    name: 'book_moudle_edit',
    meta: {
      title: '编辑栏目',
      code: 'book_famous'
    }
  },
];

export default bookRouter;
