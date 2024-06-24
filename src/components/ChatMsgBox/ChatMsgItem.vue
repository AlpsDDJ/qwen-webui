<script setup lang="ts">

import {useChatSessionStore} from "@/store/ChatSession";

const props = defineProps<{
  msg: ChatMsg
}>()
const isUserMsg = computed(() => props.msg.type === 'send')
const { sending } = storeToRefs(useChatSessionStore())

const docReferenceClickHandler = (doc: DocReference) => {
  console.log('doc ---> ', doc)
}
const typewriterRef = ref()
const handleReplay = () => {
  typewriterRef.value?.loadData()
}
</script>

<template>
  <div class="chat-msg-item">
    <div class="flex" :class="isUserMsg ? 'justify-end' : 'justify-start'">
      <template v-if="!isUserMsg">
        <svg-icon name="Robot" class="user-avatar mr-8px"/>
        <div class="msg-content qwen-message">
          <typewriter ref="typewriterRef" :msg="msg"/>
          <div class="msg-footer color-#707279 font-size-12px" v-if="!sending">
            <div class="doc-references flex mt-16px line-height-20px" v-if="msg.docReferences?.length">
              <div>回答来源：</div>
              <div class="flex flex-col">
                <div class="doc-references-item color-#2c2c73" v-for="doc in msg.docReferences" @click="docReferenceClickHandler(doc)">
                  <span>{{ doc.index_id }}</span>
                  <!--                <n-badge :value="doc.index_id" color="cyan"/>-->
                  <span>{{ doc.doc_name }}</span>
                </div>
              </div>
            </div>
            <div class="msg-control flex justify-end mb-6px">
              <n-button quaternary size="tiny" color="#707279" class="font-size-12px" @click="handleReplay">
                <template #icon>
                  <svg-icon name="IosRepeat"/>
                </template>
              </n-button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="msg-content user-message">
          <typewriter :msg="msg"/>
        </div>
        <svg-icon v-if="isUserMsg" name="MdPerson" class="user-avatar ml-8px"/>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-msg-item {
  width: 100%;
  margin-bottom: 16px;

  .msg-content {
    background-color: #ffffff;
    padding: 0 10px;
    border-radius: 6px;
    border: rgb(222, 222, 222) 1px solid;

    :deep(p) {
      margin-block-start: 0.6em;
      margin-block-end: 0.6em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      unicode-bidi: isolate;
    }

    .msg-footer {
      .doc-references {
        line-height: 24px;

        &-item {
          margin-bottom: 4px;
          cursor: pointer;

          span {
            border-radius: 3px;
            border: 1px solid #e5e7eb;

          }
          span:first-child {
            font-size: 10px;
            padding: 0 4px;
          }
          span:last-child {
            margin-left: 8px;
            display: inline-block;
            font-size: 12px;
            line-height: 24px;
            padding: 0 6px;
          }
        }
      }
    }
  }


  .user-avatar {
    font-size: 24px;
    margin-top: 6px;
  }

  @message-padding: 60px;

  .user-message {
    margin-left: @message-padding;
    background-color: rgb(231, 248, 255);
  }

  .qwen-message {
    margin-right: @message-padding;
    background-color: rgba(0, 0, 0, 0.05);
  }
  @media screen and (max-width: @min-screen-width) {
    .user-message, .qwen-message {
      margin-left: 0;
      margin-right: 0;
    }
  }
}

</style>