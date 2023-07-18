<template>
  <section
    class="section p-4 border-2 border-slate-500 rounded-lg flex flex-col justify-center items-center"
  >
    <h1 class="text-xl font-medium mb-2">Chat GPT Example</h1>
    <button
      type="button"
      class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      @click="onGoToChatGpt"
    >
      Go to chat GPT
    </button>
  </section>
</template>

<script>
export default {
  name: 'IndexPage',
  methods: {
    onGoToChatGpt() {
      this.$router.push('/mitra-chat-gpt')
    },
  },
}
</script>

<style scoped>
.section {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
