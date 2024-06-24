<script setup lang="ts">

defineOptions({name: 'ToolBar'})
</script>

<template>
  <div class="tool-bar flex justify-between items-center">
    <div><clear-session-button /></div>
    <div>
<!--      <clear-session-button />-->
    </div>
  </div>
</template>

<style scoped lang="less">
.tool-bar {
  padding:  6px 12px 0 12px;
  //padding-top: 6px;
  //padding-left: 12px;
  //padding-right: 12px;
  border-top: 1px solid #e5e5e5;
}
</style>