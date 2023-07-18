<template>
  <div class="header bg-white shadow-md flex flex-row items-center p-8">
    <button type="button" class="cursor-pointer" @click="onBackClick">
      <p class="mr-8">&lt;-</p>
    </button>
    <p class="font-medium">Example App</p>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  methods: {
    onBackClick() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
}
</style>
