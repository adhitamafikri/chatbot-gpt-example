<template>
  <main id="main" class="bg-slate-100">
    <app-header></app-header>
    <Nuxt />
  </main>
</template>

<script>
import AppHeader from '~/components/AppHeader'

export default {
  name: 'Default',
  components: { AppHeader },
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
  padding-top: 64px;
}
</style>
