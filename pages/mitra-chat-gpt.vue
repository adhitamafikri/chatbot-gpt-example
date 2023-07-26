<template>
  <section>
    <div
      ref="messageList"
      class="message-list bg-slate-200 p-4"
      :class="{ 'message-list--has-options': hasOptions }"
    >
      <template v-for="(message, id) in messages">
        <chat-bubble
          :key="`bubble-${id}`"
          :message="message"
          class="mt-4"
        ></chat-bubble>
      </template>
    </div>

    <chat-options v-if="hasOptions" :options="options"></chat-options>
    <typing-area></typing-area>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  },
  watch: {
    getIsChatting(newVal) {
      if (newVal) {
        receiveMessageInterval = setInterval(this.receiveMessagesAction, 10000)
      }
    },
  },
  beforeDestroy() {
    clearInterval(receiveMessageInterval)
  },
  mounted() {
    this.getChatLogs()
  },
  methods: {
    ...mapActions({
      getChatLogs: 'chatbotGpt/getChatLogs',
      receiveMessagesAction: 'chatbotGpt/receiveMessages',
    }),
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
