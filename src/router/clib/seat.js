const seatRouter = [
  {
    path: '/seat/index',
    component: () => import('@/views-clib/seat/index'),
    name: 'seat',
    meta: {
      title: '座位管理',
      code: 'seat'
    }
  },
  {
    path: '/seat/select/:id',
    component: () => import('@/views-clib/seat/select-seat.vue'),
    name: 'seat_select',
    meta: {
      title: '座位设置',
      code: 'seat'
    }
  },
  {
    path: '/seat/setup/unified',
    component: () => import('@/views-clib/seat/unified-setup.vue'),
    name: 'seat_order_setup',
    meta: {
      title: '统一设置',
      code: 'white'
    }
  }
];

export default seatRouter;
