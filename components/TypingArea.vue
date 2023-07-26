<template>
  <div
    class="typing-area bg-white p-4 border-t flex flex-row justify-between items-center"
  >
    <input
      id="text-message"
      v-model="textMessage"
      type="text"
      placeholder="Any message"
      class="flex-1 border border-slate-300 rounded-lg p-2 mr-4"
      @keyup.enter="sendMessage"
    />
    <button
      type="button"
      class="w-20 border border-slate-300 rounded-lg p-2"
      @click="sendMessage"
    >
      Send
    </button>
  </div>
</template>

<script>
import chatbotGptEventBus, { busEvents } from '~/utils/chatbotGptEventBus'

export default {
  name: 'TypingArea',
  data() {
    return {
      textMessage: '',
    }
  },
  methods: {
    sendMessage() {
      chatbotGptEventBus.$emit(busEvents.sendMessage, {
        text: this.textMessage,
      })
      this.textMessage = ''
    },
  },
}
</script>

<style scoped>
.typing-area {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  z-index: 10;
}
</style>
