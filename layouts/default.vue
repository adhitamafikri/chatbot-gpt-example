<template>
  <main id="main" class="bg-gray-100">
    <Nuxt />
  </main>
</template>

<script>
export default {
  name: 'Default',
}
</script>

<style lang="css">
#main {
  min-width: 480px;
  max-width: 640px;
  height: 100vh;
  overflow: auto;
  margin: auto;
  position: relative;
}
</style>
