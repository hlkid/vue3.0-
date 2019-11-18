
const app = {
  state: {
    vloading:false,
    sidebar:true,
  },
  mutations: {
    TOGGLE_SIDEBAR:(state, sidebar) => {
      state.sidebar = sidebar
    },
    TOGGLE_VLOADING:(state, vloading) => {
      state.vloading = vloading
    }
  },
  actions: {
    ToggleSidebar: ({ commit },sidebar) => {
      commit('TOGGLE_SIDEBAR',sidebar)
    },
    ToggleVloading: ({ commit },vloading) => {
      commit('TOGGLE_VLOADING',vloading)
    }
  }
}

export default app
