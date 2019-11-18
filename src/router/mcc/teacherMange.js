/**
 * 师资管理
 */
const teacherMangeRouter = [
    // 老师风采
    {
        path: '/teacherMange/teacherStyle',
        component: () => import('@/views-mcc/teacherMange/teacherStyle'),
        name: 'teacherMange_teacherStyle',
        meta: {
            title: '老师风采',
            code: 'teacherMange_teacherStyle'
        }
    },

    {
        path: '/teacherMange/teacherStyle/form',
        component: () => import('@/views-mcc/teacherMange/teacherStyle/form'),
        name: 'teacherStyle_form',
        meta: {
            title: '表单',
            code: 'teacherMange_teacherStyle'
        }
    },
    {
        path: '/teacherMange/teacherStyle/detail',
        component: () => import('@/views-mcc/teacherMange/teacherStyle/detail'),
        name: 'teacherStyle_view',
        meta: {
            title: '详情',
            code: 'teacherMange_teacherStyle'
        }
    },

    // 教师课程
    {
        path: '/teacherMange/teacherCourse',
        component: () => import('@/views-mcc/teacherMange/teacherCourse'),
        name: 'teacherMange_teacherCourse',
        meta: {
            title: '教师课程',
            code: 'teacherMange_teacherCourse'
        }
    },
    {
        path: '/teacherMange/teacherCourse/form',
        component: () => import('@/views-mcc/teacherMange/teacherCourse/form'),
        name: 'teacherCourse_form',
        meta: {
            title: '表单',
            code: 'teacherMange_teacherCourse'
        }
    },
    {
        path: '/teacherMange/teacherCourse/detail',
        component: () => import('@/views-mcc/teacherMange/teacherCourse/detail'),
        name: 'teacherCourse_view',
        meta: {
            title: '详情',
            code: 'teacherMange_teacherCourse'
        }
    },

    // 教师课程课件
    {
        path: '/teacherMange/courseWare',
        component: () => import('@/views-mcc/teacherMange/courseWare'),
        name: 'teacherMange_courseWare',
        meta: {
            title: '教师课程课件',
            code: 'teacherMange_courseWare'
        }
    },
    {
        path: '/teacherMange/courseWare/form',
        component: () => import('@/views-mcc/teacherMange/courseWare/form'),
        name: 'courseWare_form',
        meta: {
            title: '表单',
            code: 'teacherMange_courseWare'
        }
    },
    {
        path: '/teacherMange/courseWare/detail',
        component: () => import('@/views-mcc/teacherMange/courseWare/detail'),
        name: 'courseWare_view',
        meta: {
            title: '详情',
            code: 'teacherMange_courseWare'
        }
    },
]

export default teacherMangeRouter;
