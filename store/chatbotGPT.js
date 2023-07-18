import Cookies from 'js-cookie'
import generateMutations from '~/utils/generate-mutations'

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
  receiveMessage: { ...DEFAULT_STATE },
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
  { state: 'receiveMessage', action: 'receiveMessage' },
  { state: 'endSession', action: 'endSession' },
]
const mutations = {
  ...generateMutations([...mutationGeneratorParams]),
}

export default {
  state,
  getters,
  mutations,
}
