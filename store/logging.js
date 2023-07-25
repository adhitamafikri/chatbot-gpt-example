const state = () => ({
  logs: [],
})

const getters = {
  getLogs: (state) => state.logs,
}

const mutations = {
  setLogs: (state, payload = {}) => {
    state.logs = [...state.logs, payload]
  },
}

const actions = {
  log: ({ commit }, { message = '', type = 'info' }) => {
    commit('setLogs', { message, type })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
