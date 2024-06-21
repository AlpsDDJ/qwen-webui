<script setup lang="ts">
import {useChatMsgStore} from '@/store/chatMsg';
import {ScrollbarInst} from "naive-ui";
import {useEventBus} from "@vueuse/core";

defineOptions({name: 'ChatMsgBox'})

const {msgList, sending} = storeToRefs(useChatMsgStore())
const scrollbarRef = ref<ScrollbarInst>()

const scrollToBottom = () => {
  nextTick(() => {
    const el = document.querySelector('.chat-msg-box')
    scrollbarRef.value?.scrollBy({top: el?.scrollHeight, behavior: 'smooth'})
  })
}

const onSendEvent = useEventBus<string>('send')
const onAnswerUpdateEvent = useEventBus<void>('answerUpdate')

onSendEvent.on(scrollToBottom)
onAnswerUpdateEvent.on(scrollToBottom)

onMounted(() => {
  scrollToBottom()
})

onBeforeUnmount(() => {
  onSendEvent.off(scrollToBottom)
  onAnswerUpdateEvent.off(scrollToBottom)
})
</script>

<template>
  <n-scrollbar ref="scrollbarRef" content-style="overflow: hidden;">
    <div class="chat-msg-box">
      <chat-msg-item v-for="(item, index) in msgList" :key="index" :msg="item"/>
    </div>
  </n-scrollbar>
</template>

<style scoped lang="less">
.chat-msg-box {
  padding: 24px;
  overflow-y: auto;
}

</style>