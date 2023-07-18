const MESSAGES_LS_KEY = 'messages'

export const sendMessage = ({ message = {}, sessionKey = null }) => {
  console.log('Sending Message')
  const messages = localStorage.getItem(MESSAGES_LS_KEY)
    ? JSON.parse(localStorage.getItem(MESSAGES_LS_KEY))
    : []

  return Promise((resolve, reject) => {
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
      localStorage.setItem(MESSAGES_LS_KEY, JSON.parse(newMessages))
      resolve({
        data: {
          message,
          msg: 'Successfully sent',
        },
      })
      clearTimeout(timeout)
    }, 3000)
  })
}

export const sendAttachment = ({ attachment = '', sessionKey = null }) => {
  console.log('Sending Attachment')
  return Promise((resolve, reject) => {
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
    }, 3000)
  })
}

export const receiveMessages = ({ sessionKey = null, etag = null }) => {
  console.log('Receiving Messages')
  return Promise((resolve, reject) => {
    const reqHeaders = {
      session_key: sessionKey,
      etag,
    }
    console.log('requesting with headers', reqHeaders)
    const timeout = setTimeout(() => {
      const messages = localStorage.getItem(MESSAGES_LS_KEY)
        ? JSON.parse(localStorage.getItem(MESSAGES_LS_KEY))
        : []
      resolve({
        data: {
          messages,
          msg: 'Success get message',
        },
      })
      clearTimeout(timeout)
    }, 3000)
  })
}
