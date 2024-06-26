<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";
import {InputInst} from "naive-ui";

defineOptions({
  name: 'ChatSider'
})

const chatSessionStore = useChatSessionStore();
const {newSession, setSessionName, setCurrentChat, removeChat} = chatSessionStore
const {sessions, currentSession} = storeToRefs(chatSessionStore)

const addChatHandler = () => {
  newSession()
}

const editNameKey = ref<string>()
const editName = ref<string>()

const editNameHandler = (key: string, name: string = '随便聊聊') => {
  console.log('edit name')
  editNameKey.value = key
  editName.value = name
  // nextTick(() => {
  //   nextTick(() => {
  //     console.log('editNameRef.value ---> ', editNameRef.value.focus)
  //   })
  //   // editNameRef.value.focus()
  // })
}
const saveNameHandler = (key: string) => {
  console.log('save name --> ', editName.value)
  setSessionName(editName.value, key)
  editNameKey.value = undefined
}

const focusNameInput = (event: InputEvent) => {
  (event.target as HTMLInputElement).focus()
}

</script>

<template>
  <div class="chat-session h-full">
    <div class="w-90% min-h-100px mb-20px"></div>
    <div class="w-full flex-1">
      <div class="w-full flex flex-col items-center">
        <div v-for="(session, key) in sessions" :key="key" :class="key === currentSession ? 'current-session': ''"
             @click="setCurrentChat(key)"
             class="chat-session-item">
          <div class="session-name flex h-28px flex items-center justify-between">
            <template v-if="key !== editNameKey">
              <span class="mr-12px ml-10px" @click="editNameHandler(key, session.name)">
                {{ session.name ?? '随便聊聊' }}
              </span>
              <n-button text size="tiny" class="delete-session-btn" @click.stop="removeChat(key)">删除</n-button>
            </template>
            <n-input v-else v-model:value="editName" size="small" @blur="saveNameHandler(key)"
                     @mouseover="focusNameInput"/>
          </div>
          <div class="flex justify-between session-info">
            <span>{{ session.messages?.length ?? 0 }} 条对话</span>
            <!--        <span>{{ session.createTime }}</span>-->
            <n-time :time="session.createTime" type="datetime"/>
          </div>
        </div>
      </div>

    </div>
    <n-flex justify="space-between" class="w-80% mb-20px">
      <setting-button/>
      <n-button @click="addChatHandler" size="small" ghost class="custom-button">新建聊天</n-button>
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
      }

      &:hover {
        .delete-session-btn {
          display: inline-block;
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