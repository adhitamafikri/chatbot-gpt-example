<template>
  <div
    class="bubble w-100 flex flex-col"
    :class="{
      'items-start': nick !== 'visitor',
      'items-end': nick === 'visitor',
    }"
  >
    <!-- Inner contains the text message and the options -->
    <div
      class="bubble__inner bg-white shadow-lg border border-slate-300 rounded-lg p-4"
    >
      <div v-html="message.content" />

      <div v-if="bubbleOptions && hasOptions" class="bubble__options mt-2">
        <button
          v-for="(option, id) in options"
          :key="`option-${id}`"
          type="button"
          class="w-full bg-lime-100 p-2 border rounded mt-2"
          @click="onOptionClick(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>
    <div class="bubble__timestamp mt-2">
      <p class="text-xs">{{ timestamp }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import chatbotGptEventBus, { busEvents } from '~/utils/chatbotGptEventBus'

export default {
  name: 'ChatBubble',
  props: {
    message: {
      type: Object,
      required: true,
    },
    bubbleOptions: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    content() {
      return this.message.content
    },
    nick() {
      return this.message.nick
    },
    timestamp() {
      const { timestamp } = this.message
      return timestamp ? new Date(timestamp).toUTCString() : ''
    },
    options() {
      return this.message.options
    },
    hasOptions() {
      return !!this.options?.length
    },
  },
  methods: {
    ...mapActions({
      log: 'logging/log',
    }),

    onOptionClick(option = '') {
      chatbotGptEventBus.$emit(busEvents.sendMessage, {
        text: option,
      })
      this.log({
        message: `onOptionClick() - ChatBubble - ${option}`,
      })
    },
  },
}
</script>

<style scoped>
.bubble__inner {
  max-width: 85%;
}
</style>
