import Vue from 'vue'

export const busEvents = {
  sendMessage: 'sendMessage',
  sendAttachment: 'sendAttachment',
  receiveMessage: 'receiveMessage',
  endSession: 'endSession',
}

const chatbotGptEventBus = new Vue()

export default chatbotGptEventBus
