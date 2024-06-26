import {generateRandomString} from "@/utils";
import {QwenParams, QwenSSELoader} from "@/api/qwen";
import {useEventBus} from "@vueuse/core/index";

const onAnswerUpdateEvent = useEventBus<void>('answerUpdate')

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
        setCurrentModel(model: ChatModelConfig) {
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
        getMsgById(id: MsgId) {
            console.log('id -->', id)
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
            this.addRobotMsg(msg)
            return msg
        },
        mergeMsg(msg: Partial<ChatMsg>) {
            this.sessions[this.currentSession].messages = this.sessions[this.currentSession].messages?.map(item => item.id === msg.id ? {...item, ...msg} : item)
        },
        async replayMsg(userMsgId: MsgId, msgId?: MsgId) {
            const useMsg = this.getMsgById(userMsgId)
            if (useMsg) {
                await this.addRobotMsg(useMsg, msgId)
            }
        },
        async addRobotMsg(userMsg: ChatMsg, id?: MsgId) {
            const params: QwenParams = {
                input: {prompt: userMsg?.content},
                parameters: {
                    incremental_output: true
                },
                debug: true
            }
            const msgId = id ?? generateRandomString()
            const mergeMsg = (msg: Partial<ChatMsg>) => {
                this.mergeMsg({...msg, id: msgId})
            }
            const sseLoader = new QwenSSELoader();
            sseLoader.onConnection = () => {
                if (!this.messages.some(item => item.id === id)) {
                    this.sessions[this.currentSession]?.messages?.push({
                        type: 'receive',
                        content: '',
                        userMsgId: userMsg.id,
                        status: 'local',
                        id: msgId
                    })
                }
                onAnswerUpdateEvent.emit()
                mergeMsg({status: 'pending'})
            }
            sseLoader.onError = () => {
                // this.mergeMsg({ status: 'error'})
                mergeMsg({status: 'error'})
            }
            sseLoader.onDone = (displayedText) => {
                mergeMsg({content: displayedText, status: displayedText ? 'success' : 'error'})
            }

            sseLoader.onMessage = ({text, session_id, doc_references, finish_reason}, displayedText) => {
                if (finish_reason !== 'stop') {
                    this.setSessionId(session_id)
                    mergeMsg({content: displayedText})
                } else {
                    mergeMsg({docReferences: doc_references})
                }
                onAnswerUpdateEvent.emit()
            }
            await sseLoader.send(params)
        }
    },
    persist: {
        key: 'ChatSession', // 修改存在缓存中的key值
        paths: ['sessions', 'currentSession']
    }
})

