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
  sessionId: null,
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
}

const actions = {
  setSessionId: ({ commit }, { sessionId = '' }) => {
    const oneMinute = new Date().getTime() + 1 * 60 * 1000
    commit('setSessionId', { sessionId, expires: new Date(oneMinute) })
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
    const sessionId = getters.getSessionId

    /**
     * temporary because of localStorage
     * if the actual action calls API,
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
      commit('beginSendMessage')
      const sessionId = getters.getSessionId || uuidv4()
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

  receiveMessages: async ({ commit, dispatch, getters }) => {
    try {
      commit('beginReceiveMessages')
      const sessionId = getters.getSessionId || uuidv4()
      const etag = getters.getEtag
      dispatch('setSessionId', { sessionId })
      dispatch('setEtag', { etag })

      const { data } = await receiveMessages({ sessionId, etag })
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
