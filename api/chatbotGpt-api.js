import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { COOKIE_NAME, LS_KEYS } from '~/utils/storage-keys'
import { MESSAGE_SCHEMA } from '~/schemas/message'

export const sendMessage = ({ message = {}, sessionId = null }) => {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_id: sessionId,
    }
    const reqBody = {
      message,
    }
    console.log('requesting with headers', reqHeaders)
    console.log('requesting with body', reqBody)
    const timeout = setTimeout(() => {
      resolve({
        data: {
          message,
          msg: 'Successfully sent',
        },
      })
      clearTimeout(timeout)
    }, 1000)
  })
}

export const sendAttachment = ({ message = {}, sessionId = null }) => {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_id: sessionId,
    }
    const reqBody = {
      message,
    }
    console.log('requesting with headers', reqHeaders)
    console.log('requesting with body', reqBody)
    const timeout = setTimeout(() => {
      resolve({
        data: {
          message,
          msg: 'Attachment Successfully sent',
        },
      })
      clearTimeout(timeout)
    }, 1000)
  })
}

export const receiveMessages = ({ sessionId = null, etag = null }) => {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_id: sessionId,
      etag,
    }
    console.log('requesting with headers', reqHeaders)

    const dummyReply = [
      {
        ...MESSAGE_SCHEMA,
        content: 'Reply from GPT',
        nick: 'gpt',
      },
      {
        ...MESSAGE_SCHEMA,
        content: 'Reply from GPT With Options',
        options: ['PJ Morton', 'Mali', 'Bryson Tiller'],
        nick: 'gpt',
      },
      {
        ...MESSAGE_SCHEMA,
        content: 'Reply from GPT With Options',
        options: [
          'PJ Morton',
          'Mali',
          'Bryson Tiller',
          'TM88',
          'Snoh Aalegra',
          'Migos',
        ],
        nick: 'gpt',
      },
    ]
    const index = Math.round(Math.random() * 5)
    const selectedReply = dummyReply[index]
    // const selectedReply = dummyReply[2]

    const messages = localStorage.getItem(LS_KEYS.messages)
      ? JSON.parse(localStorage.getItem(LS_KEYS.messages))
      : []
    const newMessages = [...messages, ...(selectedReply ? [selectedReply] : [])]

    const sessionIdServerCookie = Cookies.get(COOKIE_NAME.sessionIdServer)
    let sessionIdForResponse = sessionIdServerCookie

    if (!sessionIdForResponse) {
      const expiredAt = new Date().getTime() + 5 * 60 * 1000
      sessionIdForResponse = uuidv4()
      Cookies.set(COOKIE_NAME.sessionIdServer, sessionIdForResponse, {
        expires: new Date(expiredAt),
      })
    }

    const etagServerCookie = Cookies.get(COOKIE_NAME.etagServer)
    let etagForResponse = etagServerCookie

    if (!etagForResponse) {
      const expiredAt = new Date().getTime() + 5 * 60 * 1000
      etagForResponse = uuidv4()
      Cookies.set(COOKIE_NAME.etagServer, etagForResponse, {
        expires: new Date(expiredAt),
      })
    }

    const timeout = setTimeout(() => {
      resolve({
        data: {
          messages: newMessages,
          session_id: sessionIdForResponse,
          etag: etagForResponse,
          msg: 'Success get messages',
        },
      })
      clearTimeout(timeout)
    }, 1000)
  })
}

export const endSession = ({ sessionId = null }) => {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_id: sessionId,
    }
    console.log('requesting with headers', reqHeaders)
    const timeout = setTimeout(() => {
      resolve({
        data: {
          msg: 'Success Ending Session',
        },
      })
      clearTimeout(timeout)
    }, 1000)
  })
}
