<script setup lang="ts">
import {useMessage} from "naive-ui";
import {useAppStore} from "@/store/App";
import {useChatSessionStore} from "@/store/ChatSession";
import {useEventBus} from "@vueuse/core/index";
import {useWindowSize} from "@vueuse/core";

const appStore = useAppStore();
const {isTextInput, collapsed} = storeToRefs(appStore)

window.$message = useMessage()

const chatMsgStore = useChatSessionStore();
// const {inputContent: content} = storeToRefs(chatMsgStore)
const onSendEvent = useEventBus<string>('send')

const { width } = useWindowSize()

watch(width, (val) => {
  collapsed.value = val < 768;
}, { immediate: true })

const send = (constent: string) => {
  console.info('发送消息：', constent)
  if (!constent) {
    return
  }
  chatMsgStore.addUserMsg(constent)
}
onSendEvent.on(send)
</script>

<template>
  <div class="flex justify-center items-center h-full w-full">
    <n-layout class="chat-box" has-sider>
      <n-layout-sider class="chat-menu" bordered :collapsed="collapsed" :collapsed-width="0" :width="width < 768 ? '100%' : undefined" :show-collapsed-content="false">
        <chat-sider />
      </n-layout-sider>
      <n-layout-content class="chat-box-body">
        <div class="h-full flex flex-col justify-between">
          <n-layout-header>
            <chat-box-header/>
          </n-layout-header>
          <chat-msg-box class="flex-1 min-h-0"/>
          <n-layout-footer>
            <tool-bar/>
            <message-input v-if="isTextInput"/>
            <stt-button v-else/>
          </n-layout-footer>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style scoped lang="less">
.chat-box {
  @media screen and (max-width: @min-screen-width) {
    width: 100%;
    height: 100%;
  }
  width: 80vw;
  height: 90vh;
  max-width: 1200px;
  border-radius: 14px;
  border: 1px solid rgb(224, 224, 230);
  background-color: #ffffff;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.15), 0 20px 25px rgba(0, 0, 0, 0.1);
  .chat-menu {
    background-color: #e7f8ff;
  }

  &-body {
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 4px 0;
  }
}

</style>