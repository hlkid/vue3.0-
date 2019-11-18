// 评论管理
const commentRouter = [
  {
    path: '/comment',
    component: () => import('@/views-mcc/comment'),
    name: 'comment',
    meta: {
      title: '评论管理',
      code: 'comment'
    }
  },
]

export default commentRouter
