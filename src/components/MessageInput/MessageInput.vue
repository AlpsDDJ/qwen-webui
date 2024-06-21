<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession';
import {useEventBus} from "@vueuse/core";

const chatMsgStore = useChatSessionStore();

const {sending, inputContent: content} = storeToRefs(chatMsgStore)


const emits = defineEmits<{
  (e: 'send', msg: string): void
}>()

const onSendEvent = useEventBus<string>('send')

const send = async () => {
  if (!content.value) {
    return
  }
  emits('send', content.value)
  chatMsgStore.addUserMsg(content.value)
  onSendEvent.emit(content.value)
  content.value = ''
}

const handleKeyDown = async (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault()
    await send()
  }
}
const autosize = {
  minRows: 3,
  maxRows: 15
}
</script>

<template>
  <div class="m-12px">
    <n-input v-model:value="content" type="textarea" :autosize="autosize" autofocus placeholder="Enter 发送，Shift + Enter 换行"
             @keydown.enter="handleKeyDown">
      <template #suffix>
        <div class="h-100% flex items-end flex-content-end pb">
          <n-button strong secondary type="success" @click="send" :loading="sending">
            <template #icon>
              <svg-icon name="IosSend"/>
            </template>
            发送
          </n-button>
        </div>
      </template>
    </n-input>
  </div>
</template>

<style scoped lang="less">
:deep(.n-input--textarea, .n-input--focus) {
  .n-input-wrapper {
    resize: none;
  }
}
</style>