<script setup lang="ts">
import {fetchStreamedData} from "@/api/request";
import {QwenParams, sendQwen} from "@/api/qwen";
import {useChatMsgStore} from "@/store/chatMsg";
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  html: true
})

const props = defineProps<{
  msg: ChatMsg
}>()

const displayedText = ref('');
const typing = ref(false);

const chatMsgStore = useChatMsgStore();
const {changeLoading, getUserMsg, changeMsg} = chatMsgStore

async function readStream(reader: any) {
  console.log('reader ---> ', reader)
  // typing.value = true
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      typing.value = false;
      Object.assign(props.msg, {content: displayedText.value})
      break;
    }
    const chunkText = new TextDecoder().decode(value);
    for (const splitText of chunkText.split('\n')) {
      if (splitText.startsWith('data:')) {
        let jsonData: any
        try {
          jsonData = JSON.parse(splitText.substring(5))
        } catch (err) {
          console.info('chunkText ---> ', chunkText)
          console.error(err)
        }
        const {text, finish_reason, doc_references} = jsonData.output || {}
        if (finish_reason !== 'stop') {
          displayedText.value += text;
          typing.value = true;
          await new Promise(resolve => setTimeout(resolve, 50)); // 控制打字速度
          // for (const char of text) {
          //   // if (char === '\n') continue; // 忽略换行符
          //   displayedText.value += char;
          //   console.log('displayedText.value --> ', displayedText.value)
          //   typing.value = true;
          //   await new Promise(resolve => setTimeout(resolve, 50)); // 控制打字速度
          // }
        } else {
          Object.assign(props.msg, {docReferences: doc_references})
        }
      }
    }

  }
}

const loadData = async () => {
  displayedText.value = ''
  Object.assign(props.msg, {fetched: true, content: '', docReferences: []})
  const userMsg = getUserMsg(props.msg?.userMsgId ?? '')
  const params: QwenParams = {
    input: {prompt: userMsg?.content},
    parameters: {
      // result_format: "message",
      incremental_output: true
    },
    debug: {}
  }
  const reader = await sendQwen(params).finally(() => {
    changeLoading(false)
  });
  await readStream(reader);
}

defineExpose<{
  loadData: typeof loadData
}>({
  loadData
})

onMounted(async () => {
  if (props.msg.fetched === false) {
    await loadData()
  } else {
    displayedText.value = props.msg.content
  }
});
</script>

<template>
  <!--  <n-code class="typewriter" :code="displayedText" language="Markdown" word-wrap />-->
  <div class="typewriter color-#1f2328" v-html="markdown.render(displayedText)" />
</template>

<style scoped lang="less">
:deep(.doc-marking) {
  color: aquamarine;
}

.typewriter {
  //white-space: nowrap;
  overflow: hidden;

  :deep(ref) {
    color: rgba(135, 138, 171, .8);
  }
}

.typing-dot {
  //display: inline-block;
  //width: 1ch;
  //opacity: 0;
  animation: blink 0.5s step-end infinite;
}

@keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>