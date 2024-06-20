<script setup lang="ts">
const audioTime = ref<number>(0)
const showAudioTime = ref<boolean>(false)
let audioTimer: any

const startRecording = () => {
  audioTimer && clearInterval(audioTimer)
  if (showAudioTime.value) {
    audioTime.value = 0
    showAudioTime.value = false
  } else {
    showAudioTime.value = true
    audioTimer = setInterval(() => {
      audioTime.value++
    }, 1000)
  }
}
</script>

<template>
  <div class="tool-bar flex justify-between items-center">
    <n-button strong tertiary round :type="showAudioTime ? 'error' : 'success'" @click="startRecording">
      <template #icon>
        <svg-icon :name="!showAudioTime ? 'IosMic' : 'IosMicOff'" />
      </template>
      <span v-if="showAudioTime" class="ml-6px">{{ audioTime }}</span>
    </n-button>
  </div>
</template>

<style scoped lang="less">
.tool-bar {
  padding-top: 12px;
  padding-left: 24px;
  padding-right: 24px;
  border-top: 1px solid #e5e5e5;
}
</style>