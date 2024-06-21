
type ChatModelConfigState = {
    models: ChatModelConfig[]
}

export const useChatModelConfig = defineStore('ChatModelConfig', {
    state: (): ChatModelConfigState => ({
        models: []
    }),
    persist: {
        key: 'ChatModelConfig', // 修改存在缓存中的key值
        paths: ['models']
    }
})