<template>
  <section>
    <div
      ref="messageList"
      class="message-list bg-slate-200 p-4"
      :class="{
        'message-list--has-options':
          hasOptions && !shouldDisplayOptionsInBubble,
      }"
    >
      <template v-for="(message, id) in messages">
        <chat-bubble
          :key="`bubble-${id}`"
          :message="message"
          :bubble-options="shouldDisplayOptionsInBubble"
          class="mt-4"
        ></chat-bubble>
      </template>

      <div
        ref="referenceLine"
        class="reference-line w-full bg-yellow-200"
        style="height: 40px"
      ></div>
    </div>

    <chat-options
      v-if="hasOptions && !shouldDisplayOptionsInBubble"
      :options="options"
    ></chat-options>
    <typing-area></typing-area>

    <div
      v-if="attachmentPreview.active"
      class="attachment-preview flex flex-row justify-center items-center"
    >
      <div
        class="attachment-previw__content flex flex-row justify-center items-center"
        style="width: 80%"
      >
        <img :src="attachmentPreview.src" style="width: auto; height: 100%" />
        <div
          class="attachment-preview__actions w-full flex flex-row justify-between items-center p-4"
        >
          <button
            class="text-white font-bold"
            type="button"
            @click="onAttachmentPreviewClose"
          >
            Close
          </button>
          <button
            v-if="!attachmentPreview.previewOnly"
            class="text-white font-bold"
            type="button"
            @click="onAttachmentSend"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import chatbotGptEventBus, { busEvents } from '~/utils/chatbotGptEventBus'
import { MESSAGE_SCHEMA } from '~/schemas/message'
import TypingArea from '~/components/TypingArea.vue'
import ChatBubble from '~/components/ChatBubble.vue'
import ChatOptions from '~/components/ChatOptions.vue'

let receiveMessageInterval = null

const INACTIVITY_TIME_LIMIT = 60
let currentInactiveTime = 0
let inactivityInterval = null

export default {
  name: 'MitraChatGPT',
  components: { TypingArea, ChatBubble, ChatOptions },
  data() {
    return {
      attachmentPreview: {
        active: false,
        src: '', // base64
        previewOnly: false,
      },
    }
  },
  computed: {
    ...mapGetters({
      getMessages: 'chatbotGpt/getMessages',
      getIsChatting: 'chatbotGpt/getIsChatting',
      getOptionsMode: 'chatbotGpt/getOptionsMode',
    }),

    messages() {
      return this.getMessages
    },

    /**
     * Used for <chat-options />
     *
     * lastMessage()
     * options()
     * hasOptions()
     */
    lastMessage() {
      const messagesLength = this.messages?.length
      if (!messagesLength) {
        return {}
      }
      return this.getMessages[messagesLength - 1]
    },

    options() {
      if (!this.lastMessage) {
        return
      }

      return this.lastMessage.options
    },

    hasOptions() {
      return !!this.options?.length
    },

    shouldDisplayOptionsInBubble() {
      return this.getOptionsMode === 'bubble'
    },
  },
  watch: {
    getIsChatting(newVal) {
      if (newVal) {
        receiveMessageInterval = setInterval(this.receiveMessagesAction, 10000)
      }
    },
  },
  mounted() {
    this.getChatLogs()

    this.$nextTick(() => {
      chatbotGptEventBus.$on(busEvents.sendMessage, this.onSendMessage)
      chatbotGptEventBus.$on(
        busEvents.attachmentPreview,
        this.onAttachmentPreview
      )
      chatbotGptEventBus.$on(busEvents.receiveMessage, this.onReceiveMessage)

      this.$refs.messageList.addEventListener('scroll', this.inactivityHandler)
      window.addEventListener('mousemove', this.inactivityHandler)
      window.addEventListener('touchend', this.inactivityHandler)
      window.addEventListener('keyup', this.inactivityHandler)

      inactivityInterval = setInterval(() => {
        currentInactiveTime++
        console.log('inactiveTime', currentInactiveTime)
        if (currentInactiveTime === INACTIVITY_TIME_LIMIT) {
          alert('INACTIVE FOR TOO LONG')
          clearInterval(inactivityInterval)
        }
      }, 1000)
    })
  },
  beforeDestroy() {
    clearInterval(receiveMessageInterval)
    chatbotGptEventBus.$off(busEvents.sendMessage, this.onSendMessage)
    chatbotGptEventBus.$off(
      busEvents.attachmentPreview,
      this.onAttachmentPreview
    )
    chatbotGptEventBus.$off(busEvents.receiveMessage, this.onReceiveMessage)

    this.$refs.messageList.removeEventListener('scroll', this.inactivityHandler)
    window.removeEventListener('mousemove', this.inactivityHandler)
    window.removeEventListener('touchend', this.inactivityHandler)
    window.removeEventListener('keyup', this.inactivityHandler)
  },
  methods: {
    ...mapActions({
      getChatLogs: 'chatbotGpt/getChatLogs',
      sendMessageAction: 'chatbotGpt/sendMessage',
      sendAttachmentAction: 'chatbotGpt/sendAttachment',
      receiveMessagesAction: 'chatbotGpt/receiveMessages',
    }),

    /**
     * @param {Event} evt
     */
    inactivityHandler(evt) {
      if (evt) {
        currentInactiveTime = 0
      }
    },

    /**
     * This action will be invoked by every component that $emits 'sendMessage' event from chatbotGptEventBus
     * This action will actually send the message
     * @param {object} param - emitted from 'sendMessage' event from chatbotGptEventBus
     * @param {string} param.text - emitted from 'sendMessage' event from chatbotGptEventBus
     */
    onSendMessage({ text = '' }) {
      try {
        const message = {
          ...MESSAGE_SCHEMA,
          content: text,
          nick: 'visitor',
        }
        this.sendMessageAction({ message })
        this.scrollToBottom()
      } catch (error) {
        console.log('error', error)
      }
    },

    onReceiveMessage() {
      console.log('receiving message')
    },

    scrollToBottom() {
      const { top } = this.$refs.referenceLine.getBoundingClientRect()
      const into = this.$refs.messageList.scrollHeight
      const finalPosition = top + into
      this.$refs.messageList.scrollTo({
        top: finalPosition,
        behavior: 'smooth',
      })
    },

    /**
     * This action will be invoked by every component that $emits 'attachmentPreview' event from chatbotGptEventBus
     * This action will actually send the message
     * @param {object} param - emitted from 'attachmentPreview' event from chatbotGptEventBus
     * @param {string} param.attachment - base64
     * @param {boolean} param.previewOnly
     */
    onAttachmentPreview({ attachment = '', previewOnly = false }) {
      this.attachmentPreview = {
        active: true,
        src: attachment,
        previewOnly,
      }
    },
    onAttachmentPreviewClose() {
      this.attachmentPreview = {
        active: false,
        src: '',
        previewOnly: false,
      }
    },
    onAttachmentSend() {
      try {
        const message = {
          ...MESSAGE_SCHEMA,
          attachment: this.attachmentPreview.src,
          nick: 'visitor',
        }
        this.sendMessageAction({ message })
        this.scrollToBottom()
        this.onAttachmentPreviewClose()
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}
</script>

<style scoped>
.message-list {
  width: 100%;
  height: calc(100vh - (64px + 64px));
  overflow: auto;
}
.message-list--has-options {
  height: calc(100vh - (64px + 64px + 64px));
}

.attachment-preview {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 13;
}
.attachment-preview__actions {
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
