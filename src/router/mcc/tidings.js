// 我的消息
const tidingsRouter = [
  // ---------------------我的消息 start-----------------
  {
    path: '/tidings',
    component: () => import('@/views-mcc/tidings/index.vue'),
    name: 'tidings',
    meta: {
      title: '我的消息',
      code: 'tidings'
    }
  }
]

export default tidingsRouter
