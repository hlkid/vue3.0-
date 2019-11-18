import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
/* 页面基本布局 */
// import App from '../App';

import Layout from '@/layout/layout'
// login
import loginRouter from "./login.js"

import configRouter from './config.js'


import volunteer from "./volunteer/index.js"//志愿者

import clibRouter from "./clib/index.js"

import mccRouter from "./mcc/index.js"
// 采购
// 实施管理
// 系统配置模块
export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    // redirect: '/home',
    children: [
      ...configRouter,

      ...volunteer,

      ...clibRouter,

      ...mccRouter
    ]
  },

  ...loginRouter,
  {
    path: '/404', component: () => import(/* webpackChunkName: "404" */ '@/views-common/error/404'), hidden: true, name: '404',
    meta: {
      code: 'white'
    }
  },
  {
    path: '*', redirect: '/404', hidden: true,
    meta: {
      code: 'white'
    }
  }
]

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_PUBLIC_PATH,
  routes: constantRouterMap
})
