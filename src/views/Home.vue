<script setup lang="ts">
  // import {useChatMsgStore} from "@/store/chatMsg";
  //
  // const { addUserMsg } = useChatMsgStore()
  // const handleSend = (msg: string) => {
  //   console.log('send --> ', msg)
  //   const userMsg = addUserMsg(msg)
  // }
</script>

<template>
  <div class="flex justify-center items-center h-100vh w-100vw">
    <div class="chat-box">
      <chat-box-header />
      <div class="chat-box-body flex-1">
        <chat-msg-box />
        <tool-bar />
        <message-input />
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
  background-color: azure;

  &-body {
    display: flex; /* 使用Flex布局 */
    flex-direction: column; /* 默认值，但明确指出垂直布局 */
    height: calc(100% - 50px);
  }
}

</style>