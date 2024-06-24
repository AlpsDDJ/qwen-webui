import {generateRandomString} from "@/utils";

export const useChatSessionStore = defineStore('ChatSession', {
    state: (): ChatSessionState => ({
        sessions: {
            default: {
                messages: [],
                // sessionId: generateRandomString()
            }
        },
        currentSession: 'default',
        loading: false,
        inputContent: ''
    }),
    getters: {
        messages: (state) => state.sessions[state.currentSession]?.messages ?? [],
        model: (state) => state.sessions[state.currentSession]?.chatConfig,
        sessionId: (state) => state.sessions[state.currentSession]?.sessionId,
        sending: (state) => state.loading,
        content: (state) => state.inputContent
    },
    actions: {
        setCurrentChat(chat: string) {
            this.currentSession = chat
        },
        setCurrentModel (model: ChatModelConfig) {
            this.sessions[this.currentSession].chatConfig = model
        },
        newChat() {
            this.sessions[this.currentSession].messages = []
        },
        setSessionId(sessionId: string) {
            this.sessions[this.currentSession].sessionId = sessionId
        },
        clearSession(chat?: string) {
            this.sessions[chat ?? 'default'].messages = []
            this.sessions[chat ?? 'default'].sessionId = undefined
        },
        removeChat(chat: string) {
            delete this.sessions[chat]
        },
        changeLoading(loading: boolean) {
            this.loading = loading
        },
        setInputContent(content?: string) {
            this.inputContent = content ?? ''
        },
        getUserMsg(id: MsgId) {
            console.log('id -->',  id)
            console.log('this.sessions[this.currentSession] ---> ', this.sessions[this.currentSession])
            return this.sessions[this.currentSession]?.messages?.find(msg => msg.id === id)
        },
        addUserMsg(content: string, id?: MsgId) {
            this.loading = true
            !this.sessions[this.currentSession] && (this.sessions[this.currentSession].messages = [])
            const _id = id || generateRandomString()
            const msg = {
                type: 'send',
                content,
                id: _id
            } as ChatMsg;

            this.sessions[this.currentSession].messages?.push(msg)
            // await this.addRobotMsg('', _id)
            this.addEmptyRobotMsg(_id)
            return msg
        },
        changeMsg(msg: ChatMsg){
            this.sessions[this.currentSession].messages = this.sessions[this.currentSession].messages?.map(item => item.id === msg.id ? msg : item)
        },
        addEmptyRobotMsg(forMsgId: MsgId) {
            !this.sessions[this.currentSession] && (this.sessions[this.currentSession].messages = [])
            this.sessions[this.currentSession]?.messages?.push({
                type: 'receive',
                content: '',
                userMsgId: forMsgId,
                fetched: false,
                id: generateRandomString()
            } as ChatMsg)
        },
        async addRobotMsg(content: string, forMsgId: MsgId, id?: MsgId) {
            !this.sessions[this.currentSession] && (this.sessions[this.currentSession].messages = [])
            this.sessions[this.currentSession].messages.push({
                type: 'receive',
                content,
                userMsgId: forMsgId,
                id: id || generateRandomString()
            } as ChatMsg)
        },
    },
    persist: {
        key: 'ChatSession', // 修改存在缓存中的key值
        paths: ['sessions', 'currentSession']
    }
})

