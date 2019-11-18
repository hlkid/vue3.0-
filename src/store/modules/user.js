import { login, logOut } from "@/api/mcc/login.js"
import { getClibLogin } from "@/api/clib/clogin";
import { getBLogin } from "@/api/mcc/index.js";
import { getToken, setToken, removeToken, getCookie, setCookie, removeCookie, setSessionStorage, getSessionStorage, removeSessionStorage } from '@/utils/auth'
const user = {
  state: {
    token: getToken(),
    orgNum: getCookie('orgNum'),
    venueNum: getCookie('venueNum'),
    resource: getSessionStorage('resource') ? getSessionStorage('resource') : {},
    breadCrumbList: getSessionStorage('breadCrumbList') ? getSessionStorage('breadCrumbList') : [],
    userInfo: getSessionStorage('userInfo'), // 这里写初始值
    avatar: getSessionStorage('avatar') ? getSessionStorage('avatar') : ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ORGNUM: (state, orgNum) => {
      state.orgNum = orgNum
    },
    SET_RESOURCE: (state, resource) => {
      state.resource = resource;
    },
    SET_BREADCRUMBLIST: (state, breadCrumbList) => {
      state.breadCrumbList = breadCrumbList;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_VENUENUM: (state, venueNum) => {
      state.venueNum = venueNum
    }
  },
  actions: {
    setAvatar: ({ commit }, avatar) => {
      commit('SET_AVATAR', avatar)
    },
    setToken: ({ commit }, token) => {
      commit('SET_TOKEN', token)
    },
    setVenueNum: ({ commit }, venueNum) => {
      setCookie('venueNum', venueNum);
      commit('SET_VENUENUM', venueNum);
    },
    setResource: ({ commit }, resource) => {
      commit('SET_RESOURCE', resource)
    },
    setOrgNum: ({ commit }, orgNum) => {
      setCookie('orgNum', orgNum)
      commit('SET_ORGNUM', orgNum);
    },
    setBreadCrumbList: ({ commit }, breadCrumbList) => {
      commit('SET_BREADCRUMBLIST', breadCrumbList)
    },
    // 登录
    Login({ commit }, query) {
      return new Promise((resolve, reject) => {
        getBLogin(query).then(res => {
          let token = res.data.token;
          let hbAppId = res.data.hbAppId ? res.data.hbAppId : '';
          let venueNum = res.data.venueNums ? res.data.venueNums.join(',') : '';
          if (token) {
            setToken(token);
            setCookie('venueNum', venueNum);
            setCookie('hbAppId', hbAppId);
            setSessionStorage('userInfo', res.data);
            commit('SET_VENUENUM', venueNum);
            commit('SET_TOKEN', token);
            commit('SET_USERINFO', res.data);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logOut().then(res => {
          commit('SET_TOKEN', '');
          commit('SET_ORGNUM', '');
          commit('SET_USERINFO', '');
          commit('SET_VENUENUM', '');
          commit('SET_AVATAR', '');
          // commit('SET_ROLES', [])
          removeSessionStorage('userInfo');
          removeSessionStorage('avatar');
          removeCookie('token')
          removeCookie('venueNum')
          removeCookie('orgNum')
          //router.push('/login')
          location.href =  process.env.VUE_APP_BASE_PUBLIC_PATH + 'login';
          resolve(res)
        }).catch(error => {
          //router.push('/login')
          location.href = process.env.VUE_APP_BASE_PUBLIC_PATH + 'login';
          reject(error)
        })
      })
    },

    getCLogin({ commit }, query){
      return new Promise((resolve, reject) => {
        getClibLogin(query).then(res=>{
          let token = res.data.token;
          let hbAppId = res.data.hbAppId ? res.data.hbAppId : '';
          let venueNum = res.data.venueNums ? res.data.venueNums.join(',') : '';
          if (token) {
            setToken(token);
            setCookie('venueNum', venueNum);
            setCookie('hbAppId', hbAppId);
            setSessionStorage('userInfo', res.data);
            commit('SET_VENUENUM', venueNum);
            commit('SET_TOKEN', token);
            commit('SET_USERINFO', res.data);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    }
  }
}

export default user
