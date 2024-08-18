import {SpeechRecognitionOptios} from "@/hooks/useSpeech/types";
import {waitFor} from "@/utils";

const defaultOptions: SpeechRecognitionOptios = {
    lang: window.navigator.language || 'zh-CN',
    continuous: false,
    interimResults: true
}

export const useSpeechRecognition = (options?: SpeechRecognitionOptios) => {
    const recognition = ref<any>()
    const results = ref<string[]>([])
    // const content = ref<string>('')
    const speeching = ref<boolean>(false)
    const speechTimer = ref<number>(0)
    const waitStop = ref<boolean>(false)
    let speechTimerInterval: any

    const opts = {...defaultOptions, ...options}
    const tempContent = ref<string>('')
    if (!recognition.value) {
        try {
            recognition.value = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
            console.log('SpeechRecognition: ', recognition.value)
        } catch (error) {
            throw new Error('浏览器不支持语音识别')
        }

        if (recognition.value) {
            recognition.value.continuous = opts.continuous
            recognition.value.interimResults = opts.interimResults
            recognition.value.lang = opts.lang // 设置为语言
            recognition.value.onresult = (event: any) => {
                const result = event.results[event.results.length - 1];
                const transcript = result[0].transcript;
                if (result.isFinal) {
                    waitStop.value && (speeching.value = false)
                    results.value.push(tempContent.value)
                    tempContent.value = ''
                    if (typeof opts.onresult === 'function') {
                        opts.onresult(results.value.join())
                        console.debug(`STT Result:`, results.value.join())
                    }
                } else {
                    tempContent.value = transcript;
                    if (typeof opts.onresult === 'function') {
                        opts.onresult(results.value.join() + transcript)
                    }
                }
            }
            recognition.value.onend = () => {
                console.log('STT end: ', waitStop.value)
                !waitStop.value && recognition.value.start()
            }
            recognition.value.onerror = (event: any) => {
                console.log('STT error', event)
                window.$message.error('语音识别出错')
                speeching.value = false
            }
        } else {
            window.$message.error('浏览器不支持语音识别')
        } // 加上容错处理
    }

    const start = async (isNew: boolean = true) => {
        if (recognition.value) {
            console.log('STT Start')
            if (speeching.value) {
                return
            }
            if (isNew) {
                speechTimerInterval && clearInterval(speechTimerInterval)
                speechTimerInterval = setInterval(() => {
                    speechTimer.value += 1
                }, 1000)
                speeching.value = true
                waitStop.value = false
                speechTimer.value = 0
                results.value = []
                // content.value = ''
            }
            await recognition.value.start()
        }
    }


    const stop = async (): Promise<string | undefined> => {
        if (recognition.value && speeching.value) {
            console.log('STT Stop')
            waitStop.value = true
            await recognition.value.stop()
            await waitFor(() => speeching.value, 30)
            return results.value.join()
        }
    }

    return {
        start,
        stop,
        speechTimer,
        speeching,
        results
    }
}