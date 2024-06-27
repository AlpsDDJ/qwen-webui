<script setup lang="ts">
import {useChatSessionStore} from '@/store/ChatSession'

const {clearSession} = useChatSessionStore()
</script>

<template>

  <n-popconfirm>
    <template #trigger>
      <n-button text type="warning">
        <template #icon>
          <Icon icon-name="Eraser" type="tabler" />
        </template>
      </n-button>
    </template>
    <template #action>
      <n-button text type="primary" @click="() => clearSession()">确定</n-button>
    </template>
    <span>清空当前会话?</span>
  </n-popconfirm>
</template>

<style scoped lang="less"></style>