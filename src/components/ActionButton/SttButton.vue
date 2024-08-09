<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";
import {useAppStore} from "@/store/App";
import {useEventBus} from "@vueuse/core/index";

defineOptions({name: 'SttButton'})

const audioTime = ref<number>(0)
const recording = ref<boolean>(false)
let audioTimer: any

const content = ref<string>('')
const tempContent = ref<string>('')
let recognition: any

const {setInputContent} = useChatSessionStore();
const appStore = useAppStore();
const {toggleInputType} = appStore
const {isDesktop, isTextInput} = storeToRefs(appStore)
const chatMsgStore = useChatSessionStore();
const {inputContent} = storeToRefs(chatMsgStore)

// const isDesktop = computed(() => {
//   return deviceType.value === 'desktop'
// })

const createRecognition = () => {
  if (!recognition) {
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
        if (result.isFinal) {
          content.value += transcript;
          setInputContent(content.value)
        } else {
          tempContent.value = transcript;
          setInputContent(content.value + tempContent.value)
        }
        // console.log(content.value)
      }
      recognition.onend = () => {
        recording.value && recognition.start()
      }

    } else {
      window.$message.error('浏览器不支持语音识别')
    } // 加上容错处理
  }
}

const speek = (start?: boolean) => {
  if (typeof start === 'boolean') {
    recording.value = !start
  }
  audioTimer && clearInterval(audioTimer)
  if (recording.value) {
    console.info('语音识别结束')
    recording.value = false
    recognition.stop()
    audioTime.value = 0
    content.value = ''
  } else {
    console.info('语音识别开始')
    recording.value = true
    recognition.start()
    audioTimer = setInterval(() => {
      audioTime.value++
    }, 1000)
  }
}

const handelTouchStart = () => {
  speek(true)
}
const onSendEvent = useEventBus<string>('send')

onSendEvent.on(() => {
  console.log('onDoSendEvent')
})

const touchButton = ref()

const handelTouchEnd = (event: TouchEvent) => {


  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;

  // 判断抬起时是否还在按钮上
  const buttonRect = touchButton.value.getBoundingClientRect();
  const isHovering = endX >= buttonRect.left && endX <= buttonRect.right && endY >= buttonRect.top && endY <= buttonRect.bottom;
  console.log('handelTouchEnd ---isHovering---> ', isHovering)

  speek(false)
  if (isHovering) {
    onSendEvent.emit(inputContent.value)
  }
  inputContent.value = ''
  // if(!!inputContent.value) {
  //   onDoSendEvent.emit('doSend')
  // }
}

onMounted(() => {
  createRecognition()

  const mouseupHandler = (event: MouseEvent) => {
    // console.log('mouseupHandler ---> ', event)
    switch (event.button) {
      case 3:
        speek(false)
        event.preventDefault()
        setTimeout(() => {
          onSendEvent.emit(inputContent.value)
          inputContent.value = ''
        }, 500)
        break
      case 4:
        speek(true)
        event.preventDefault()
        break
      default:
        break
    }
    // if (event.button === 'Enter') {
    //   onSendEvent.emit(inputContent.value)
  }
  document.removeEventListener('mouseup', mouseupHandler)
  document.addEventListener('mouseup', mouseupHandler)
})

</script>

<template>

  <n-popover trigger="manual" :show="recording" v-if="isTextInput">
    <template #trigger>
      <n-button v-if="isDesktop" text size="tiny" :type="recording ? 'error' : 'success'" @click="speek(undefined)">
        <template #icon>
          <svg-icon :name="!recording ? 'IosMic' : 'IosMicOff'"/>
        </template>
      </n-button>
      <n-button v-else text size="tiny" type="success" @click="toggleInputType">
        <svg-icon name="IosMic"/>
      </n-button>
    </template>
    <span>{{ audioTime }}</span>
  </n-popover>
  <n-popover v-else trigger="manual" :show="!!inputContent">
    {{ inputContent }}
    <template #trigger>
      <div class="touch-mic-btn flex justify-between items-center flex-content-center"
           :class="recording ? 'is-active' : ''">
        <div class="toggle-button flex items-center mr-6px">
          <svg-icon name="KeyboardAltRound" view-box="0 0 24 24" @click.stop="toggleInputType"/>
        </div>
        <div ref="touchButton" @touchstart.prevent="handelTouchStart" @touchend="handelTouchEnd"
             class="touch-button flex-1 text-align-center">
          按住说话
        </div>
        <div></div>
      </div>
    </template>
  </n-popover>
</template>

<style scoped lang="less">
@touch-mic-btn-color: 24, 160, 88;
.touch-mic-btn {
  border: 1px solid rgb(224, 224, 230);
  margin: 6px 12px 18px;
  padding: 0 12px;
  border-radius: 18px;
  color: rgb(@touch-mic-btn-color);

  &.is-active {
    border-color: rgba(@touch-mic-btn-color, 0.2);
    background-color: rgba(@touch-mic-btn-color, 0.16);
    animation: shadow-breathe 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes shadow-breathe {
    0%, 100% {
      box-shadow: 0 0 2px 1px rgba(@touch-mic-btn-color, 0.1);
    }
    50% {
      box-shadow: 0 0 4px 2px rgba(@touch-mic-btn-color, 0.3);
    }
  }

  //
  //.toggle-button {
  //}
  //
  .touch-button {
    padding: 6px;
  }
}

</style>