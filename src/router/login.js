
let defaultLogin = () => import(/* webpackChunkName: "login" */ '@/views-common/login/index.vue');
// 爱读网
let ireadLogin = () => import(/* webpackChunkName: "login" */ '@/views-mcc/login/iread.vue');
// 牧心活动云
let mxhdyLogin = () => import(/* webpackChunkName: "login" */ '@/views-mcc/login/mxhdy.vue');
// 云图
let clibLogin = () => import(/* webpackChunkName: "login" */ '@/views-clib/clib-login/index.vue');

let loginComponent = defaultLogin;

function setLoginComponent(enname){
  switch (enname) {
    case 'iread':
      loginComponent = ireadLogin;
      break;
    case 'mxhdy':
      loginComponent = mxhdyLogin;
      break;
    case 'clib':
      loginComponent = clibLogin;
      break;
  };
}
setLoginComponent(process.env.VUE_APP_BASE_ENNAME);

let loginRouter = [
  {
    path: '/login', component: loginComponent,
    hidden: true,
    name: 'login',
    meta: {
      code: 'white'
    }
  }
]
export default loginRouter
