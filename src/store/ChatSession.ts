import {generateRandomString} from "@/utils";
import {QwenParams, QwenSSELoader} from "@/api/qwen";
import {useEventBus} from "@vueuse/core/index";
import Icon from "@/components/Icon/index.vue";

const onAnswerUpdateEvent = useEventBus<void>('answerUpdate')

export const useChatSessionStore = defineStore('ChatSession', {
    state: (): ChatSessionState => ({
        sessions: {
            default: {
                messages: [],
                name: '随便聊聊',
                createTime: new Date().getTime()
            }
        },
        currentSession: 'default',
        inputContent: ''
    }),
    getters: {
        session: (state) => state.sessions[state.currentSession],
        messages: (state) => state.sessions[state.currentSession]?.messages ?? [],
        model: (state) => state.sessions[state.currentSession]?.chatConfig,
        sessionId: (state) => state.sessions[state.currentSession]?.sessionId,
        content: (state) => state.inputContent
    },
    actions: {
        setCurrentChat(chat: string) {
            this.currentSession = chat
        },
        setCurrentModel(model: ChatModelConfig) {
            this.sessions[this.currentSession].chatConfig = model
        },
        newSession(sessionKey: string = generateRandomString()) {
            this.sessions[sessionKey] = {
                messages: [],
                name: '新的聊天',
                createTime: new Date().getTime()
            }
            this.setCurrentChat(sessionKey)
        },
        setSessionId(sessionId: string) {
            this.sessions[this.currentSession].sessionId = sessionId
        },
        setSessionName(name: string, chat?: string) {
            this.sessions[chat ?? this.currentSession].name = name
        },
        clearSession(chat?: string) {
            const sessionKey = chat ?? this.currentSession
            this.sessions[sessionKey].messages = []
            this.sessions[sessionKey].sessionId = undefined
        },
        removeChat(chat: string) {
            if(Object.keys(this.sessions).length === 1) {
                window.$message.warning('最后一个了，留一个吧！', {
                    icon: () => h(Icon, { iconName: 'MdSad', size: 18 })
                })
                return
            }
            delete this.sessions[chat]
            if(chat === this.currentSession) {
                this.currentSession = Object.keys(this.sessions)[0]
            }
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
                mergeMsg({status: 'error'})
            }
            sseLoader.onDone = (displayedText) => {
                mergeMsg({content: displayedText, status: displayedText ? 'success' : 'error'})
            }

            sseLoader.onMessage = ({session_id, doc_references, finish_reason}, displayedText) => {
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

