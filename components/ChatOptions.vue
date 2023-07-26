<template>
  <div class="chat-options w-full bg-white border flex items-center p-2">
    <div
      v-for="(option, id) in options"
      :key="`chat-opt-${id}`"
      class="chat-options__chip bg-orange-200 p-2 border rounded grow shrink-0 text-center mr-4"
    >
      {{ option }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatOptions',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.chat-options {
  position: fixed;
  bottom: 64px;
  left: 0;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  z-index: 10;
  overflow: auto;
}
</style>
