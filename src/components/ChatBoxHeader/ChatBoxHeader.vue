<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";
import {useAppStore} from "@/store/App";

const {session} = storeToRefs(useChatSessionStore())
const appStore = useAppStore();
const {collapsed} = storeToRefs(appStore)

</script>

<template>
  <div class="chat-box-header flex justify-around">
    <div class="chat-box-title flex items-center">
      <n-button @click="() => { collapsed = false }" size="small" ghost class="custom-button mr-20px" v-if="collapsed">
        <template #icon>
          <Icon icon-name="IosUndo"/>
        </template>
      </n-button>
      {{ session?.name }}
      <select-chat-model/>
    </div>
    <div class="chat-box-control flex justify-end items-center">
      <!--      <SettingButton />-->
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-box-header {
  border-bottom: 1px solid rgb(224, 224, 230) !important;
  height: 50px;
  padding: 0 24px;

  .chat-box-title {
    font-weight: 900;
    line-height: 50px;
    width: 100%;
  }
}
</style>