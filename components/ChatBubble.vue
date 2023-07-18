<template>
  <div
    class="bubble w-100 flex flex-column"
    :class="{
      'align-start': nick !== 'visitor',
      'align-end': nick === 'visitor',
    }"
  >
    <div
      class="bubble__inner bg-white shadow-lg border border-slate-300 rounded-lg p-4"
    >
      <div v-html="message.content" />
    </div>
    <div class="bubble__timestamp">
      <p>{{ timestamp }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBubble',
  props: {
    message: {
      type: Object,
      required: true,
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
      return this.message.timestamp
    },
  },
}
</script>

<style scoped>
.bubble__inner {
  max-width: 85%;
}
</style>
