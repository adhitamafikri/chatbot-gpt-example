<template>
  <div
    class="header bg-white shadow-md flex flex-row items-center justify-between p-4"
  >
    <div class="flex flex-row items-center">
      <button type="button" class="cursor-pointer mr-2" @click="onBackClick">
        <p>&lt;-</p>
      </button>
      <p class="font-medium">Example App</p>
    </div>

    <button
      type="button"
      class="w-20 border border-slate-300 rounded-lg p-2"
      @click="onLogsClick(true)"
    >
      Logs
    </button>

    <div v-if="isLogsActive" class="logs p-4">
      <p
        v-for="(log, id) in getLogs"
        :key="`log-${id}`"
        class="mb-4 px-2"
        :class="{
          'bg-green-200': log.type === 'info',
          'bg-red-200': log.type === 'error',
        }"
      >
        <span>
          {{ id + 1 }}.
        </span>
        {{ log.message }}
      </p>

      <button
        type="button"
        class="w-full bg-white border border-slate-300 rounded-lg p-2"
        @click="onLogsClick(false)"
      >
        close
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  data() {
    return {
      isLogsActive: false,
    }
  },
  computed: {
    ...mapGetters({
      getLogs: 'logging/getLogs',
    }),
  },
  methods: {
    onBackClick() {
      this.$router.go(-1)
    },
    onLogsClick(active = false) {
      this.isLogsActive = active
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

.logs {
  background-color: gainsboro;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 11;
  width: 280px;
  height: 240px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
