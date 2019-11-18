
const app = {
  state: {
    x: 0, y: 0, templeteName: null, templetePrice: null, confirmButtonLoading: false, reset: false, fullscreen: false
  },
  mutations: {
    changeX (state, x) {
      state.x = x
    },
    changeY (state, y) {
      state.y = y
    },
    changeTempleteName (state, templeteName) {
      state.templeteName = templeteName
    },
    changeTempletePrice (state, templetePrice) {
      state.templetePrice = templetePrice
    },
    changeConfirmButtonLoading (state, confirmButtonLoading) {
      state.confirmButtonLoading = confirmButtonLoading
    },
    changeReset (state, reset) {
      state.reset = reset
    },
    makeFullscreen (state, fullscreen) {
      state.fullscreen = fullscreen
    }
  },
  actions: {
    clearHallSeat({commit}) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('changeX', 0)
          commit('changeY', 0)
          commit('changeTempleteName', null)
          commit('changeTempletePrice', null)
          commit('changeConfirmButtonLoading', false)
          commit('changeReset', false)
          resolve()
        }, 16)
      })
    }
  }
}

export default app
