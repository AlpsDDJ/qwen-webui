<script setup lang="ts">
import {useChatSessionStore} from "@/store/ChatSession";
import {useAppStore} from "@/store/App";
import {useEventBus} from "@vueuse/core/index";
import {useSpeechRecognition} from "@/hooks/useSpeech";

defineOptions({name: 'SttButton'})

const {setInputContent} = useChatSessionStore();
const appStore = useAppStore();
const {toggleInputType} = appStore
const {isDesktop, isTextInput} = storeToRefs(appStore)
const chatMsgStore = useChatSessionStore();
const {inputContent} = storeToRefs(chatMsgStore)


const handelTouchStart = async () => {
  // speek(true)
  await start()
}
const onSendEvent = useEventBus<string>('send')

onSendEvent.on(() => {
  console.log('onDoSendEvent')
})

const touchButton = ref()

const handelTouchEnd = async (event: TouchEvent) => {


  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;

  // 判断抬起时是否还在按钮上
  const buttonRect = touchButton.value.getBoundingClientRect();
  const isHovering = endX >= buttonRect.left && endX <= buttonRect.right && endY >= buttonRect.top && endY <= buttonRect.bottom;
  console.log('handelTouchEnd ---isHovering---> ', isHovering)

  setInputContent(await stop())
  if (isHovering) {
    onSendEvent.emit(inputContent.value)
  }
  inputContent.value = ''
}

const onSTTResult = (result?: string) => {
  result && setInputContent(result)
}

const {results, speeching, speechTimer, start, stop} = useSpeechRecognition({ onresult: onSTTResult })

const toggle = async () => {
  if(speeching.value) {
    const res = await stop()
    console.log('await toggle() ---> ', res)
    setInputContent(results.value.join())
  } else {
    await start()
  }
}

onMounted(() => {
  const mouseupHandler = async (event: MouseEvent) => {
    switch (event.button) {
      // 侧键后退 --> 停止识别并发送请求
      case 3:
        setInputContent(await stop())
        event.preventDefault()
        onSendEvent.emit(inputContent.value)
        inputContent.value = ''
        break
      // 侧键前进 --> 停止识别
      case 4:
        await toggle()
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

  <n-popover trigger="manual" :show="speeching" v-if="isTextInput">
    <template #trigger>
      <n-button v-if="isDesktop" text size="tiny" :type="speeching ? 'error' : 'success'" @click="toggle">
        <template #icon>
          <svg-icon :name="!speeching ? 'IosMic' : 'IosMicOff'"/>
        </template>
      </n-button>
      <n-button v-else text size="tiny" type="success" @click="toggleInputType">
        <svg-icon name="IosMic"/>
      </n-button>
    </template>
    <span>{{ speechTimer }}</span>
  </n-popover>
  <n-popover v-else trigger="manual" :show="!!inputContent">
    {{ inputContent }}
    <template #trigger>
      <div class="touch-mic-btn flex justify-between items-center flex-content-center"
           :class="speeching ? 'is-active' : ''">
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