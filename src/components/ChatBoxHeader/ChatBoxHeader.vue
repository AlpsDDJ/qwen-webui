<script setup lang="ts">

</script>

<template>
  <div class="chat-box-header flex justify-around">
    <div class="chat-box-title flex">WebUI  <select-chat-model /></div>
    <div class="chat-box-control flex justify-end items-center">

      <SettingButton />
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-box-header {
  border-bottom: 1px solid rgb(224, 224, 230) !important;
  height: 50px;
  padding: 0 24px;

  .chat-box-title {
    font-weight: 900;
    line-height: 50px;
    width: 100%;
  }
}
</style>