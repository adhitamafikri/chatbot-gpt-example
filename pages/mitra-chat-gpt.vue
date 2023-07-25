<template>
  <section>
    <div class="message-list bg-slate-200 p-4">
      <template v-for="(message, id) in messages">
        <chat-bubble
          :key="`bubble-${id}`"
          :message="message"
          class="mt-4"
        ></chat-bubble>
      </template>
    </div>
    <typing-area></typing-area>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TypingArea from '~/components/TypingArea.vue'
import ChatBubble from '~/components/ChatBubble.vue'

let receiveMessageInterval = null

export default {
  name: 'MitraChatGPT',
  components: { TypingArea, ChatBubble },
  computed: {
    ...mapGetters({
      getMessages: 'chatbotGpt/getMessages',
      getIsChatting: 'chatbotGpt/getIsChatting',
    }),

    messages() {
      return this.getMessages
    },
  },
  watch: {
    getIsChatting(newVal) {
      if (newVal) {
        receiveMessageInterval = setInterval(this.receiveMessagesAction, 15000)
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
</style>
