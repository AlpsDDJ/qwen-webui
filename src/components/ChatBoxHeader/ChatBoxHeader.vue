<script setup lang="ts">

</script>

<template>
  <div class="chat-box-header flex justify-around">
    <div class="chat-box-title">千问 - WebUI</div>
    <div class="chat-box-control flex justify-end items-center">
      <select-chat-model class="mr-16px"/>
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