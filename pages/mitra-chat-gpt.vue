<template>
  <section>
    <div class="message-list bg-slate-200">messagelist</div>
    <typing-area></typing-area>
  </section>
</template>

<script>
import TypingArea from '~/components/TypingArea.vue'

export default {
  name: 'MitraChatGPT',
  components: { TypingArea },
}
</script>

<style scoped>
.message-list {
  width: 100%;
  height: calc(100vh - (64px + 64px));
  overflow: auto;
}
</style>
