<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession';

const {clearSession} = useChatSessionStore()
const clearSessionHandler = () => {
  clearSession()
}
</script>

<template>
  <n-button text @click="clearSessionHandler">
    <template #icon>
      <svg-icon name="Eraser24Regular" viewBox="0 0 24 24"/>
    </template>
  </n-button>
</template>

<style scoped lang="less">

</style>