<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession';
import {useEventBus} from "@vueuse/core";

const chatMsgStore = useChatSessionStore();

const {inputContent: content} = storeToRefs(chatMsgStore)


// const emits = defineEmits<{
//   (e: 'send', msg: string): void
// }>()

const onSendEvent = useEventBus<string>('send')
// const onDoSendEvent = useEventBus<string>('sendFromVoice')

const send = () => {
  onSendEvent.emit(content.value)
  content.value = ''
}

// const doSendEventHandler = (event: string) => {
//   console.log('doSendEventHandler ---> ', event)
//   send()
// }
// onDoSendEvent.on(doSendEventHandler)

const handleKeyDown = async (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault()
    send()
  }
}
const autosize = {
  minRows: 1,
  maxRows: 6
}
</script>

<template>
  <div class="message-input">
    <n-input v-model:value="content" type="textarea" :autosize="autosize"
             @keydown.enter="handleKeyDown"
             placeholder="Enter 发送，Shift + Enter 换行"
             autofocus>
      <template #prefix>
        <stt-button />
      </template>
      <template #suffix>
        <n-button text size="tiny" type="success" @click="send">
          <template #icon>
            <svg-icon class="send-btn" name="IosSend" />
          </template>
        </n-button>
      </template>
    </n-input>
  </div>
</template>

<style scoped lang="less">
.message-input {
  padding:  6px 12px 18px 12px;
  :deep(.n-input) {
    border-radius: 18px;

    .n-input__prefix,.n-input__suffix {
      align-items: end;
      padding: 10.7px 4px;
    }
  }
}
</style>