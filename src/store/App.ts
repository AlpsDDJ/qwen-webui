// import { useDeviceMotion }  from '@vueuse/core'

import {detectDeviceType} from '@/utils'

export const useAppStore = defineStore('app', {
    state: (): AppState => ({
        deviceType: detectDeviceType(),
        inputType: 'text'
    }),
    getters: {
        isDesktop: (state) => state.deviceType === 'desktop',
        isMobile: (state) => state.deviceType === 'mobile',
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
}