<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";

defineOptions({name: 'SttButton'})

const audioTime = ref<number>(0)
const showAudioTime = ref<boolean>(false)
let audioTimer: any

const content = ref<string>('')
const tempContent = ref<string>('')
let recognition: any

const { setInputContent } = useChatSessionStore();

const createRecognition = () => {
  if(!recognition) {
    try {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    } catch (error) {
      console.warn('浏览器不支持语音识别');
    }

    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = window.navigator.language || 'zh-CN'; // 设置为语言
      // const searchBox = document.getElementById('search-box');
      // const searchButton = document.getElementById('search-button');
      recognition.onresult = (event: any) => {
        // console.log(event)
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        if(result.isFinal) {
          content.value += transcript;
          setInputContent(content.value)
        } else {
          tempContent.value = transcript;
          setInputContent(content.value + tempContent.value)
        }
        // console.log(content.value)
      }
      recognition.onend = () => {
        showAudioTime.value && recognition.start()
      }

    } else {
      window.$message.error('浏览器不支持语音识别')
    } // 加上容错处理
  }
}

const speek = () => {
  audioTimer && clearInterval(audioTimer)
  if (showAudioTime.value) {
    recognition.stop()
    audioTime.value = 0
    showAudioTime.value = false
    content.value = ''
  } else {
    recognition.start()
    showAudioTime.value = true
    audioTimer = setInterval(() => {
      audioTime.value++
    }, 1000)
  }
}

onMounted(() => {
  createRecognition()
})


</script>

<template>

  <n-popover trigger="manual" :show="showAudioTime">
    <template #trigger>
      <n-button text size="tiny" :type="showAudioTime ? 'error' : 'success'" @click="speek">
        <template #icon>
          <svg-icon :name="!showAudioTime ? 'IosMic' : 'IosMicOff'"/>
        </template>
      </n-button>
    </template>
    <span>{{ audioTime }}</span>
  </n-popover>
</template>

<style scoped lang="less">

</style>