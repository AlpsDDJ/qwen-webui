<script setup lang="ts">
import MarkdownIt from 'markdown-it';
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

defineProps<{
  msg: ChatMsg
}>()
</script>

<template>
  <div class="typewriter color-#1f2328">
    <div v-html="markdown.render(msg.content ?? '')"/>
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