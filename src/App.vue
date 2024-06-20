<script setup lang="ts">
import Home from '@/views/Home.vue';
import hljs from 'highlight.js/lib/core'
import Markdown from 'highlight.js/lib/languages/markdown'

hljs.registerLanguage('Markdown', Markdown)

</script>

<template>
  <n-config-provider :hljs="hljs">
    <Home />
  </n-config-provider>
</template>

<style scoped>

</style>
