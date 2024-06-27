// import { useDeviceMotion }  from '@vueuse/core'

import {detectDeviceType} from '@/utils'
import {useWindowSize} from "@vueuse/core/index";

export const useAppStore = defineStore('app', {
    state: (): AppState => {

        const { width } = useWindowSize()

        return {
            deviceType: detectDeviceType(),
            inputType: 'text',
            collapsed: false,
            screenWidth: width
        }
    },
    getters: {
        isDesktop: (state) => state.deviceType === 'desktop',
        isMobile: (state) => state.deviceType === 'mobile' || state.screenWidth < 768,
        isPad: (state) => state.deviceType === 'pad',
        isTextInput: (state) => state.inputType === 'text',
        isAudioInput: (state) => state.inputType === 'audio'
    },
    actions: {
        toggleInputType() {
            this.inputType = this.inputType === 'text' ? 'audio' : 'text'
        }
    }
})

interface AppState {
    readonly deviceType: ReturnType<typeof detectDeviceType>
    inputType: 'text' | 'audio'
    collapsed: boolean
    screenWidth: Ref<number>
}