import Cookies from 'js-cookie'
import { LS_KEYS } from '~/utils/storage-keys'
import generateMutations from '~/utils/generate-mutations'
import {
  sendMessage,
  sendAttachment,
  receiveMessages,
  // endSession,
} from '~/api/chatbotGpt-api'

const DEFAULT_STATE = {
  loading: false,
  data: null,
  error: null,
}

const state = () => ({
  sessionId: null,
  etag: null,
  isChatting: false,
  messages: [],
  messageOptions: [],
  sendMessage: { ...DEFAULT_STATE },
  sendAttachment: { ...DEFAULT_STATE },
  receiveMessages: { ...DEFAULT_STATE },
  endSession: { ...DEFAULT_STATE },
  optionsMode: 'bubble',
})

const getters = {
  getSessionId: (state) => {
    const sessionKeyCookie = Cookies.get('sessionId')
    return sessionKeyCookie || state.sessionId
  },
  getEtag: (state) => {
    const etagCookie = Cookies.get('etag')
    return etagCookie || state.etag
  },
  getMessages: (state) => state.messages,
  getIsChatting: (state) => state.isChatting,
  getOptionsMode: (state) => state.optionsMode,
}

const mutationGeneratorParams = [
  { state: 'sendMessage', action: 'SendMessage' },
  { state: 'sendAttachment', action: 'SendAttachment' },
  { state: 'receiveMessages', action: 'ReceiveMessages' },
  { state: 'endSession', action: 'EndSession' },
]
const mutations = {
  ...generateMutations([...mutationGeneratorParams]),

  setSessionId: (state, { sessionId, expires }) => {
    state.sessionId = sessionId
    Cookies.set('sessionId', sessionId, { expires })
  },

  setEtag: (state, { etag }) => {
    state.etag = etag
    Cookies.set('etag', etag)
  },

  setIsChatting: (state, payload) => {
    state.isChatting = payload
  },

  setMessages: (state, payload) => {
    localStorage.setItem(LS_KEYS.messages, JSON.stringify(payload))
    state.messages = payload
  },

  setMessageOptions: (state, payload) => {
    state.messageOptions = payload
  },

  setOptionsMode: (state, payload) => {
    state.optionsMode = payload
  },
}

const actions = {
  setSessionId: ({ commit }, { sessionId = '' }) => {
    if (!sessionId) return

    const expiredAt = new Date().getTime() + 5 * 60 * 1000
    commit('setSessionId', { sessionId, expires: new Date(expiredAt) })
  },

  setEtag: ({ commit }, { etag = '' }) => {
    if (!etag) return

    commit('setEtag', { etag })
  },

  setIsChatting: ({ commit }, { isChatting = false }) => {
    commit('setIsChatting', isChatting)
  },

  setMessages: ({ commit }, { messages = [] }) => {
    commit('setMessages', messages)
  },

  setMessageOptions: ({ commit }, { messages = [] }) => {
    commit('setMessageOptions', messages)
  },

  setOptionsMode: ({ commit }, { mode = '' }) => {
    commit('setOptionsMode', mode)
  },

  /**
   * Invoke this action in the mounted() hook
   */
  getChatLogs: ({ dispatch, getters }) => {
    // Alt 1 - Cookie approach
    const sessionId = getters.getSessionId

    /**
     * temporaryly use process.client because of localStorage
     */
    if (process.client && sessionId) {
      dispatch('receiveMessages')

      dispatch(
        'logging/log',
        {
          message: 'getChatLog() - success getting message from API/storage',
        },
        { root: true }
      )
    }
  },

  sendMessage: async ({ commit, dispatch, getters }, { message = {} }) => {
    try {
      const currentMessages = getters.getMessages
      dispatch('setMessages', { messages: [...currentMessages, message] })

      commit('beginSendMessage')
      const sessionId = getters.getSessionId
      dispatch('setSessionId', { sessionId })

      const { data } = await sendMessage({ message, sessionId })
      commit('successSendMessage', { data })

      dispatch('setIsChatting', { isChatting: true })

      dispatch(
        'logging/log',
        {
          message: `sendMessage() - sent: ${message.content}`,
        },
        { root: true }
      )
    } catch (error) {
      commit('errorSendMessage', { error })
      dispatch(
        'logging/log',
        {
          message: `sendMessage() - error: ${error}`,
          type: 'error',
        },
        { root: true }
      )
      console.error('Something is wrong [sendMessage]', error)
    }
  },

  sendAttachment: async ({ commit, dispatch, getters }, { message = {} }) => {
    try {
      const currentMessages = getters.getMessages
      dispatch('setMessages', { messages: [...currentMessages, message] })

      commit('beginSendAttachment')
      const sessionId = getters.getSessionId
      dispatch('setSessionId', { sessionId })

      const { data } = await sendAttachment({ message, sessionId })
      commit('successSendAttachment', { data })

      dispatch('setIsChatting', { isChatting: true })

      dispatch(
        'logging/log',
        {
          message: `sendAttachment() - sent: ${message.content}`,
        },
        { root: true }
      )
    } catch (error) {
      commit('errorSendAttachment', { error })
      dispatch(
        'logging/log',
        {
          message: `sendAttachment() - error: ${error}`,
          type: 'error',
        },
        { root: true }
      )
      console.error('Something is wrong [sendAttachment]', error)
    }
  },

  receiveMessages: async ({ commit, dispatch, getters }) => {
    try {
      commit('beginReceiveMessages')
      const sessionId = getters.getSessionId
      const etag = getters.getEtag

      const { data } = await receiveMessages({ sessionId, etag })
      commit('successReceiveMessages', { data: data.messages })

      dispatch('setMessages', { messages: data.messages })
      dispatch('setSessionId', { sessionId: data.session_id })
      dispatch('setEtag', { etag: data.etag })
      dispatch('setIsChatting', { isChatting: true })

      dispatch(
        'logging/log',
        {
          message: `receiveMessages() - success`,
        },
        { root: true }
      )
    } catch (error) {
      dispatch(
        'logging/log',
        {
          message: `receiveMessages() - error`,
          type: 'error',
        },
        { root: true }
      )
      commit('errorReceiveMessages', { error })
      console.error('Something is wrong [receiveMessages]', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
