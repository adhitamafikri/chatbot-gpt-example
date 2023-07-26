<template>
  <section>
    <div
      ref="messageList"
      class="message-list bg-slate-200 p-4"
      :class="{
        'message-list--has-options':
          hasOptions && !shouldDisplayOptionsInBubble,
      }"
    >
      <template v-for="(message, id) in messages">
        <chat-bubble
          :key="`bubble-${id}`"
          :message="message"
          :bubble-options="shouldDisplayOptionsInBubble"
          class="mt-4"
        ></chat-bubble>
      </template>
    </div>

    <chat-options
      v-if="hasOptions && !shouldDisplayOptionsInBubble"
      :options="options"
    ></chat-options>
    <typing-area></typing-area>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import chatbotGptEventBus, { busEvents } from '~/utils/chatbotGptEventBus'
import { MESSAGE_SCHEMA } from '~/schemas/message'
import TypingArea from '~/components/TypingArea.vue'
import ChatBubble from '~/components/ChatBubble.vue'
import ChatOptions from '~/components/ChatOptions.vue'

let receiveMessageInterval = null

export default {
  name: 'MitraChatGPT',
  components: { TypingArea, ChatBubble, ChatOptions },
  computed: {
    ...mapGetters({
      getMessages: 'chatbotGpt/getMessages',
      getIsChatting: 'chatbotGpt/getIsChatting',
      getOptionsMode: 'chatbotGpt/getOptionsMode',
    }),

    messages() {
      return this.getMessages
    },

    /**
     * Used for <chat-options />
     *
     * lastMessage()
     * options()
     * hasOptions()
     */
    lastMessage() {
      const messagesLength = this.messages?.length
      if (!messagesLength) {
        return {}
      }
      return this.getMessages[messagesLength - 1]
    },

    options() {
      if (!this.lastMessage) {
        return
      }

      return this.lastMessage.options
    },

    hasOptions() {
      return !!this.options?.length
    },

    shouldDisplayOptionsInBubble() {
      return this.getOptionsMode === 'bubble'
    },
  },
  watch: {
    getIsChatting(newVal) {
      if (newVal) {
        receiveMessageInterval = setInterval(this.receiveMessagesAction, 10000)
      }
    },
  },
  mounted() {
    this.getChatLogs()

    chatbotGptEventBus.$on(busEvents.sendMessage, this.onSendMessage)
    chatbotGptEventBus.$on(busEvents.receiveMessage, this.onReceiveMessage)
  },
  beforeDestroy() {
    clearInterval(receiveMessageInterval)
    chatbotGptEventBus.$off(busEvents.sendMessage)
    chatbotGptEventBus.$off(busEvents.receiveMessage)
  },
  methods: {
    ...mapActions({
      getChatLogs: 'chatbotGpt/getChatLogs',
      sendMessageAction: 'chatbotGpt/sendMessage',
      receiveMessagesAction: 'chatbotGpt/receiveMessages',
    }),

    /**
     * This action will be invoked by every component that $emits 'sendMessage' event from chatbotGptEventBus
     * This action will actually send the message
     * @param {object} param - emitted from 'sendMessage' event from chatbotGptEventBus
     * @param {string} param.text - emitted from 'sendMessage' event from chatbotGptEventBus
     */
    async onSendMessage({ text = '' }) {
      try {
        const message = {
          ...MESSAGE_SCHEMA,
          content: text,
          nick: 'visitor',
        }
        await this.sendMessageAction({ message })
      } catch (error) {
        console.log('error', error)
      }
    },

    onReceiveMessage() {
      console.log('receiving message')
    },
  },
}
</script>

<style scoped>
.message-list {
  width: 100%;
  height: calc(100vh - (64px + 64px));
  overflow: auto;
}
.message-list--has-options {
  height: calc(100vh - (64px + 64px + 64px));
}
</style>
