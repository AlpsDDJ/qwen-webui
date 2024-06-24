<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession'

const {clearSession} = useChatSessionStore()
</script>

<template>

  <n-popconfirm>
    <template #trigger>
      <n-button text>
        <template #icon>
          <svg-icon name="Eraser24Regular" viewBox="0 0 24 24"/>
        </template>
      </n-button>
    </template>
    <template #action>
      <n-button text type="primary" @click="clearSession">确定</n-button>
    </template>
    <span>清除会话?</span>
  </n-popconfirm>
</template>

<style scoped lang="less"></style>