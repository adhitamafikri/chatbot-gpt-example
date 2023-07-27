<template>
  <div
    class="typing-area bg-white p-4 border-t flex flex-row justify-between items-center"
  >
    <div class="attachment-input mr-2">
      <input
        id="attachment-input"
        type="file"
        accept=".jpeg, .jpg, .png, .bmp, .gif, .pdf"
        @change="onFileChange($event)"
      />
      <label for="attachment-input">
        <p class="text-sm">Upload</p>
      </label>
    </div>
    <input
      id="text-message"
      v-model="textMessage"
      type="text"
      placeholder="Any message"
      class="flex-1 border border-slate-300 rounded-lg p-2 mr-2"
      @keyup.enter="sendMessage"
    />
    <button
      type="button"
      class="w-20 border bg-lime-200 border-slate-300 rounded-lg p-2"
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
    /**
     * @param {File} file
     */
    createImage(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // this.imagePreview = e.target.result
        chatbotGptEventBus.$emit(busEvents.attachmentPreview, {
          attachment: e.target.result,
        })
      }
      reader.readAsDataURL(file)
      return reader
    },

    /**
     * @param {Event} event
     */
    onFileChange(event) {
      const { files } = event.target
      if (!files[0]) return
      this.createImage(files[0])
    },

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

.attachment-input input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
}
</style>
