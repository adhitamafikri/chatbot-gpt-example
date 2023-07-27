import Vue from 'vue'

export const busEvents = {
  sendMessage: 'sendMessage',
  attachmentPreview: 'attachmentPreview',
  sendAttachment: 'sendAttachment',
  receiveMessage: 'receiveMessage',
  endSession: 'endSession',
}

export const busEventsPayload = {
  sendMessage: { text: '' },
  attachmentPreview: { attachment: '', previewOnly: false }, // base64
  sendAttachment: { attachment: '' }, // base64
  receiveMessage: {},
  endSession: {},
}

const chatbotGptEventBus = new Vue()

export default chatbotGptEventBus
