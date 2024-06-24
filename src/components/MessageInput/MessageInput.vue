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
  minRows: 1,
  maxRows: 6
}
</script>

<template>
  <div class="m-12px">
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

<style scoped lang="less"></style>