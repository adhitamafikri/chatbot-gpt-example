import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import generateMutations from '~/utils/generate-mutations'
import {
  sendMessage,
  // sendAttachment,
  receiveMessages,
  // endSession,
} from '~/api/chatbotGPT.api'

const DEFAULT_STATE = {
  loading: false,
  data: null,
  error: null,
}

const state = () => ({
  sessionKey: null,
  etag: null,
  isChatting: false,
  messages: [],
  messageOptions: [],
  sendMessage: { ...DEFAULT_STATE },
  sendAttachment: { ...DEFAULT_STATE },
  receiveMessages: { ...DEFAULT_STATE },
  endSession: { ...DEFAULT_STATE },
})

const getters = {
  getSessionKey: (state) => {
    const sessionKeyCookie = Cookies.get('sessionKey')
    return sessionKeyCookie || state.sessionKey
  },
  getEtag: (state) => {
    const etagCookie = Cookies.get('etag')
    return etagCookie || state.etag
  },
  getMessages: (state) => state.messages || [],
}

const mutationGeneratorParams = [
  { state: 'sendMessage', action: 'SendMessage' },
  { state: 'sendAttachment', action: 'sendAttachment' },
  { state: 'receiveMessages', action: 'receiveMessages' },
  { state: 'endSession', action: 'endSession' },
]
const mutations = {
  ...generateMutations([...mutationGeneratorParams]),

  setSessionKey: (state, { sessionKey, expires }) => {
    state.sessionKey = sessionKey
    Cookies.set('sessionKey', sessionKey, { expires })
  },

  setEtag: (state, { etag }) => {
    state.etag = etag
    Cookies.set('etag', etag)
  },

  setIsChatting: (state, payload) => {
    state.isChatting = payload
  },

  setMessages: (state, payload) => {
    state.messages = payload
  },

  setMessageOptions: (state, payload) => {
    state.messageOptions = payload
  },
}

const actions = {
  setSessionKey: ({ commit }, { sessionKey = '' }) => {
    const fiveMinutes = new Date().getTime() + 5 * 60 * 1000
    commit('setSessionKey', { sessionKey, expires: new Date(fiveMinutes) })
  },

  setEtag: ({ commit }, { etag = '' }) => {
    commit('etag', { etag })
  },

  setIsChatting: ({ commit }, { isChatting = false }) => {
    commit('isChatting', isChatting)
  },

  setMessages: ({ commit }, { messages = [] }) => {
    commit('setMessages', messages)
  },

  setMessageOptions: ({ commit }, { messages = [] }) => {
    commit('setMessageOptions', messages)
  },

  sendMessage: async ({ commit, dispatch, getters }, { message }) => {
    try {
      commit('beginSendMessage')
      const sessionKey = getters.getSessionKey || uuidv4()
      dispatch('setSessionKey', { sessionKey })

      const { data } = await sendMessage({ message, sessionKey })
      commit('successSendMessage', { data })

      dispatch('setIsChatting', { isChatting: true })
    } catch (error) {
      commit('errorSendMessage', { error })
      console.error('Something is wrong [sendMessage]')
    }
  },

  receiveMessages: async ({ commit, dispatch, getters }, { message }) => {
    try {
      commit('beginReceiveMessages')
      const sessionKey = getters.getSessionKey || uuidv4()
      const etag = getters.getEtag
      dispatch('setSessionKey', { sessionKey })
      dispatch('setEtag', { etag })

      const { data } = await receiveMessages({ sessionKey, etag })
      commit('beginReceiveMessages', { data })
      dispatch('setMessages', { messages: data.messages })

      dispatch('setIsChatting', { isChatting: true })
    } catch (error) {
      commit('errorReceiveMessages', { error })
      console.error('Something is wrong [receiveMessages]')
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
