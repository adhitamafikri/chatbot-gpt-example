import { MESSAGE_SCHEMA } from '~/schemas/message'

const MESSAGES_LS_KEY = 'messages'

export const sendMessage = ({ message = {}, sessionKey = null }) => {
  console.log('Sending Message')
  const messages = localStorage.getItem(MESSAGES_LS_KEY)
    ? JSON.parse(localStorage.getItem(MESSAGES_LS_KEY))
    : []

  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_key: sessionKey,
    }
    const reqBody = {
      message,
    }
    console.log('requesting with headers', reqHeaders)
    console.log('requesting with body', reqBody)
    const timeout = setTimeout(() => {
      const newMessages = [...messages, { ...message }]
      localStorage.setItem(MESSAGES_LS_KEY, JSON.stringify(newMessages))
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

export const sendAttachment = ({ attachment = '', sessionKey = null }) => {
  console.log('Sending Attachment')
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_key: sessionKey,
    }
    const reqBody = {
      attachment,
    }
    console.log('requesting with headers', reqHeaders)
    console.log('requesting with body', reqBody)
    const timeout = setTimeout(() => {
      resolve({
        data: {
          attachment,
          msg: 'Attachment Successfully sent',
        },
      })
      clearTimeout(timeout)
    }, 1000)
  })
}

export const receiveMessages = ({ sessionKey = null, etag = null }) => {
  console.log('Receiving Messages')
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_key: sessionKey,
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
    ]
    const index = Math.round(Math.random())
    const selectedReply = dummyReply[index]
    console.log('dummy reply', selectedReply)

    const timeout = setTimeout(() => {
      const messages = localStorage.getItem(MESSAGES_LS_KEY)
        ? JSON.parse(localStorage.getItem(MESSAGES_LS_KEY))
        : []
      const newMessages = [...messages, { ...selectedReply }]

      resolve({
        data: {
          messages: newMessages,
          msg: 'Success get messages',
        },
      })
      clearTimeout(timeout)
    }, 1000)
  })
}

export const endSession = ({ sessionKey = null }) => {
  console.log('Ending Session')
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      session_key: sessionKey,
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
