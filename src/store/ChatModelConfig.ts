import {StoreGeneric} from "pinia";

export interface ChatModelConfigState {
    models: ChatModelConfig[]
    settings: {
        qwenApiKey: string
    }
}

export const useChatModelConfig = defineStore('ChatModelConfig', {
    state: (): ChatModelConfigState => ({
        models: [],
        settings: {
            qwenApiKey: ''
        }
    }),
    persist: {
        key: 'ChatModelConfig', // 修改存在缓存中的key值
        paths: ['models', 'settings']
    }
})