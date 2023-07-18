<template>
  <section>
    <div class="message-list bg-slate-200">
      <template v-for="(message, id) in getMessages">
        <chat-bubble :key="`bubble-${id}`" :message="message"></chat-bubble>
      </template>
    </div>
    <typing-area></typing-area>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import TypingArea from '~/components/TypingArea.vue'
import ChatBubble from '~/components/ChatBubble.vue'

export default {
  name: 'MitraChatGPT',
  components: { TypingArea, ChatBubble },
  computed: {
    ...mapGetters({
      getMessages: 'chatbotGpt/getMessages',
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
