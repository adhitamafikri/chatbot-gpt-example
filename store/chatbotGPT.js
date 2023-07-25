import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { LS_KEYS } from '~/utils/storage-keys'
import generateMutations from '~/utils/generate-mutations'
import {
  sendMessage,
  // sendAttachment,
  receiveMessages,
  // endSession,
} from '~/api/chatbotGpt-api'

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
  getMessages: (state) => state.messages,
  getIsChatting: (state) => state.isChatting,
}

const mutationGeneratorParams = [
  { state: 'sendMessage', action: 'SendMessage' },
  { state: 'sendAttachment', action: 'SendAttachment' },
  { state: 'receiveMessages', action: 'ReceiveMessages' },
  { state: 'endSession', action: 'EndSession' },
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
    localStorage.setItem(LS_KEYS.messages, JSON.stringify(payload))
    state.messages = payload
  },

  setMessageOptions: (state, payload) => {
    state.messageOptions = payload
  },
}

const actions = {
  setSessionKey: ({ commit }, { sessionKey = '' }) => {
    const oneMinute = new Date().getTime() + 1 * 60 * 1000
    commit('setSessionKey', { sessionKey, expires: new Date(oneMinute) })
  },

  setEtag: ({ commit }, { etag = '' }) => {
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

  /**
   * Invoke this action in the mounted() hook
   */
  getChatLogs: ({ dispatch, getters }) => {
    // Alt 1 - Cookie approach
    const sessionKey = getters.getSessionKey

    /**
     * temporary because of localStorage
     * if the actual action calls API,
     */
    if (process.client && sessionKey) {
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
      commit('beginSendMessage')
      const sessionKey = getters.getSessionKey || uuidv4()
      dispatch('setSessionKey', { sessionKey })

      const { data } = await sendMessage({ message, sessionKey })
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

  receiveMessages: async ({ commit, dispatch, getters }) => {
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
