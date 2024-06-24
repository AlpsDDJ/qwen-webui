<script setup lang="ts">
import {fetchStreamedData} from "@/api/request";
import {QwenParams, sendQwen} from "@/api/qwen";
import {useChatSessionStore} from "@/store/ChatSession";
import MarkdownIt from 'markdown-it';
import {useEventBus} from "@vueuse/core";
import hljs from 'highlight.js'
import 'highlight.js/styles/a11y-dark.css';

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // 此处判断是否有添加代码语言
    if (lang && hljs.getLanguage(lang)) {
      try {
        // 得到经过highlight.js之后的html代码
        const preCode = hljs.highlight(lang, str, true).value
        // 以换行进行分割
        const lines = preCode.split(/\n/).slice(0, -1)
        // 添加自定义行号
        let html = lines.map((item, index) => {
          return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
        }).join('')
        html = '<ol>' + html + '</ol>'
        // 添加代码语言
        if (lines.length) {
          html += '<b class="name">' + lang + '</b>'
        }
        return '<pre class="hljs"><code>' +
            html +
            '</code></pre>'
      } catch (__) {
      }
    }
    // 未添加代码语言，此处与上面同理
    const preCode = markdown.utils.escapeHtml(str)
    const lines = preCode.split(/\n/).slice(0, -1)
    let html = lines.map((item, index) => {
      return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
    }).join('')
    html = '<ol>' + html + '</ol>'
    return '<pre class="hljs"><code>' +
        html +
        '</code></pre>'
  }
})

const props = defineProps<{
  msg: ChatMsg
}>()

const displayedText = ref('');
const typing = ref(false);

const chatMsgStore = useChatSessionStore();
const {changeLoading, getUserMsg, setSessionId} = chatMsgStore
const {sending} = storeToRefs(chatMsgStore)

const onAnswerUpdateEvent = useEventBus<void>('answerUpdate')

async function readStream(reader: any) {
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
        const {text, finish_reason, doc_references, session_id} = jsonData.output || {}
        if (finish_reason !== 'stop') {
          displayedText.value += text;
          typing.value = true;
          onAnswerUpdateEvent.emit()
          setSessionId(session_id)
          await new Promise(resolve => setTimeout(resolve, 50)); // 控制打字速度
        } else {
          Object.assign(props.msg, {docReferences: doc_references, status: 'success'})
        }
      }
    }

  }
}

const loadData = async () => {
  displayedText.value = ''
  Object.assign(props.msg, {status: 'pending', content: '', docReferences: []})
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
  console.log('props.msg.status --> ', props.msg.status)
  if (props.msg.status === 'local') {
    await loadData()
  } else {
    displayedText.value = props.msg.content
  }
});
</script>

<template>
  <!--  <n-code class="typewriter" :code="displayedText" language="Markdown" word-wrap />-->
  <div class="typewriter color-#1f2328">
    <div v-html="markdown.render(displayedText)" v-if="displayedText"/>
    <div v-else-if="!sending" class="p-8px">无数据</div>
    <div v-else class="p-8px">loading</div>
  </div>
</template>

<style scoped lang="less">
:deep(.doc-marking) {
  color: aquamarine;
}

.typewriter {
  //white-space: nowrap;
  overflow-x: auto;

  :deep(ref) {
    color: rgba(135, 138, 171, .8);
  }

  :deep(.hljs) {
    border-radius: 8px;
    padding-top: 1px;

    b.name {
      display: inline-flex;
      padding-left: 16px;
      padding-bottom: 6px;
    }
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