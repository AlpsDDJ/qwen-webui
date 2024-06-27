<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";
import {useAppStore} from "@/store/App";
import LogoIcon from "@/components/SvgIcon/LogoIcon.vue";

defineOptions({
  name: 'ChatSider'
})

const chatSessionStore = useChatSessionStore();
const {newSession, setSessionName, setCurrentChat, removeChat} = chatSessionStore
const {sessions, currentSession} = storeToRefs(chatSessionStore)
const appStore = useAppStore();
const {collapsed, isMobile} = storeToRefs(appStore)

const addChatHandler = () => {
  newSession()
}

const editNameKey = ref<string>()
const editName = ref<string>('')

const sessionItemClickHandler = (key: string) => {
  setCurrentChat(key)
  isMobile.value && (collapsed.value = true)
}

const editNameHandler = (key: string, name: string = '随便聊聊') => {
  editNameKey.value = key
  editName.value = name
}
const saveNameHandler = (key: string) => {
  setSessionName(editName.value, key)
  editNameKey.value = undefined
}

const focusNameInput = (event: InputEvent) => {
  (event.target as HTMLInputElement).focus()
}

</script>

<template>
  <div class="chat-session h-full">
    <div class="w-90% flex pb-20px justify-center items-center">
      <logo-icon class="font-size-32px"/>
      <h4 class="ml-12px">千问 - WebUI</h4>
    </div>
    <div class="w-full flex-1">
      <div class="w-full flex flex-col items-center">
        <div v-for="(session, key) in sessions" :key="key" :class="key === currentSession ? 'current-session': ''"
             @click="sessionItemClickHandler(key)"
             @click.middle="removeChat(key)"
             class="chat-session-item box-shadow">
          <div class="session-name flex h-28px flex items-center justify-between">
            <template v-if="key !== editNameKey">
              <span class="mr-12px ml-10px" @click.stop="editNameHandler(key, session.name)">
                {{ session.name ?? '随便聊聊' }}
              </span>
              <Icon icon-name="IosCloseCircleOutline" size="13" class="delete-session-btn" @click.stop="removeChat(key)"/>
            </template>
            <n-input v-else v-model:value="editName" size="small" @blur="saveNameHandler(key)"
                     @mouseover="focusNameInput"/>
          </div>
          <div class="flex justify-between session-info">
            <span>{{ (session as ChatSession).messages?.length ?? 0 }} 条对话</span>
            <!--        <span>{{ session.createTime }}</span>-->
            <n-time :time="session.createTime" type="datetime"/>
          </div>
        </div>
      </div>

    </div>
    <n-flex justify="space-between" class="w-80% mb-20px">
      <setting-button/>
      <n-button @click="addChatHandler" size="small" ghost class="custom-button">
        <template #icon>
          <Icon icon-name="IosAddCircleOutline" size="16"/>
        </template>
        聊点别的
      </n-button>
    </n-flex>
  </div>
</template>

<style scoped lang="less">
.chat-session {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .chat-session-item {
    width: 80%;
    min-height: 3.5em;
    margin-bottom: 20px;
    border-radius: 8px;
    padding: 6px;
    background-color: #ffffff;
    cursor: pointer;
    border: 2px solid transparent;
    //box-shadow: @box-shadow;
    //
    &:hover {
      border: 2px solid rgba(29, 147, 171, .35);

      .session-name .delete-session-btn {
        display: inline-block;
      }
    }

    &.current-session {
      border-color: #1d93ab;
    }

    .session-name {
      font-size: 14px;
      font-weight: bolder;

      & > span {
        cursor: text;
      }

      .delete-session-btn {
        display: none;
        margin-top: -18px;
        color: #a6a6a6;

        &:hover {
          color: #d03050;
        }
      }

    }

    .session-info {
      color: #a6a6a6;
      font-size: 12px;
      padding: 0 10px;
      margin-top: 8px;
    }
  }

  //.custom-button {
  //  background-color: #ffffff;
  //  padding: 10px;
  //  font-size: 13.3px;
  //  border-radius: 8px;
  //  height: auto;
  //  :deep(.n-button__content) {
  //    height: 16px;
  //    line-height: 16px;
  //    text-align: center;
  //  }
  //}
}
</style>