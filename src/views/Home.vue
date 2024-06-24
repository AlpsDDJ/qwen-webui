<script setup lang="ts">
  import {useMessage} from "naive-ui";
  import {useAppStore} from "@/store/App";
  import {useChatSessionStore} from "@/store/ChatSession";
  import {useEventBus} from "@vueuse/core/index";

  const appStore = useAppStore();
  const { isTextInput } = storeToRefs(appStore)

  window.$message = useMessage()

  const chatMsgStore = useChatSessionStore();
  // const {inputContent: content} = storeToRefs(chatMsgStore)
  const onSendEvent = useEventBus<string>('send')

  const send = (constent: string) => {
    console.info('发送消息：', constent)
    if (!constent) {
      return
    }
    // emits('send', content.value)
    chatMsgStore.addUserMsg(constent)
    // onSendEvent.emit(content.value)
    // content.value = ''
  }
  onSendEvent.on(send)
</script>

<template>
  <div class="flex justify-center items-center h-100% w-100vw">
    <div class="chat-box">
      <chat-box-header />
      <div class="chat-box-body flex-1">
        <chat-msg-box />
        <tool-bar />
        <message-input v-if="isTextInput"/>
        <stt-button v-else/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-box {
  @media screen and (max-width: @min-screen-width) {
    width: 100%;
    height: 100%;
  }
  width: 80%;
  height: 90%;
  max-width: 1000px;
  border-radius: 14px;
  border: 1px solid rgb(224, 224, 230);
  background-color: #ffffff;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.15), 0 20px 25px rgba(0, 0, 0, 0.1);

  &-body {
    display: flex; /* 使用Flex布局 */
    flex-direction: column; /* 默认值，但明确指出垂直布局 */
    height: calc(100% - 50px);
  }
}

</style>