const getters = {
  vloading: state => state.app.vloading,
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  orgNum: state => state.user.orgNum,
  userInfo: state => state.user.userInfo,
  avatar: state => state.user.avatar,
  resource: state => state.user.resource,
  breadCrumbList: state => state.user.breadCrumbList,
}
export default getters
