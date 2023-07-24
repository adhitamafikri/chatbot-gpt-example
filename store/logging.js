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
  log: ({ commit }, { log = '', type = 'info' }) => {
    commit('setLogs', { log, type })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
