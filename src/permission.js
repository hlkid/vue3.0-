import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  //console.log(to,from)
    if (isVisit(to.meta.code)) {
      next()
    }else{
      next('/login')
    }
})

router.afterEach((to, from) => {
  //console.log(to, from)
  let token = store.state.user.token;
    if (!token) {
      router.push('/login')
    }
})

//根据用户资源判断是否可访问
function isVisit(code){
  let menuResource = store.state.user.resource.menuResource ? store.state.user.resource.menuResource : [];
  let r = false;
  //对比资源列表
  menuResource.forEach(item=>{
    if (code === item.menuIdentify) {
      r = true
    }
  })
  //白名单
  if (code === 'white'){
    r = true
  }
  return r
}
