
type ChatModelConfigState = {
    models: ChatConfig[]
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