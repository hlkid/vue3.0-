/**
 * 非遗管理
 */
const inheritanceRouter = [
    {
        path: '/inheritance/:typeCode/:type',
        component: () => import('@/views-mcc/inheritance'),
        name: 'inheritance',
        meta: {
            title: '非遗管理',
            code: 'inheritance'
        }
    },
    {
        path: '/inheritance/:typeCode/:type/form',
        component: () => import('@/views-mcc/inheritance/form'),
        name: 'inheritance_form',
        meta: {
            title: '表单',
            code: 'inheritance'
        }
    },
    {
        path: '/inheritance/:typeCode/:type/detail',
        component: () => import('@/views-mcc/inheritance/detail'),
        name: 'inheritance_view',
        meta: {
            title: '详情',
            code: 'inheritance'
        }
    }
]

export default inheritanceRouter;
