import {generateRandomString} from "@/utils";

export const useChatMsgStore = defineStore('chatMsg', {
    state: (): ChatMsgState => ({
        chatMap: {
            default: []
        },
        currentChat: 'default',
        loading: false,
        inputContent: ''
    }),
    getters: {
        msgList: (state) => state.chatMap[state.currentChat],
        sending: (state) => state.loading,
        content: (state) => state.inputContent
    },
    actions: {
        setCurrentChat(chat: string) {
            this.currentChat = chat
        },
        newChat() {
            this.chatMap[this.currentChat] = []
        },
        clearMsg(chat?: string) {
            this.chatMap[chat || 'default'] = []
        },
        removeChat(chat: string) {
            delete this.chatMap[chat]
        },
        changeLoading(loading: boolean) {
            this.loading = loading
        },
        setInputContent(content?: string) {
            this.inputContent = content ?? ''
        },
        getUserMsg(id: MsgId) {
            console.log('id -->',  id)
            console.log('this.chatMap[this.currentChat] ---> ', this.chatMap[this.currentChat])
            return this.chatMap[this.currentChat].find(msg => msg.id === id)
        },
        addUserMsg(content: string, id?: MsgId) {
            this.loading = true
            !this.chatMap[this.currentChat] && (this.chatMap[this.currentChat] = [])
            const _id = id || generateRandomString()
            const msg = {
                type: 'send',
                content,
                id: _id
            } as ChatMsg;

            this.chatMap[this.currentChat].push(msg)
            // await this.addRobotMsg('', _id)
            this.addEmptyRobotMsg(_id)
            return msg
        },
        changeMsg(msg: ChatMsg){
            this.chatMap[this.currentChat] = this.chatMap[this.currentChat].map(item => item.id === msg.id ? msg : item)
        },
        addEmptyRobotMsg(forMsgId: MsgId) {
            !this.chatMap[this.currentChat] && (this.chatMap[this.currentChat] = [])
            this.chatMap[this.currentChat].push({
                type: 'receive',
                content: '',
                userMsgId: forMsgId,
                fetched: false,
                id: generateRandomString()
            } as ChatMsg)
        },
        async addRobotMsg(content: string, forMsgId: MsgId, id?: MsgId) {
            !this.chatMap[this.currentChat] && (this.chatMap[this.currentChat] = [])
            this.chatMap[this.currentChat].push({
                type: 'receive',
                content,
                userMsgId: forMsgId,
                id: id || generateRandomString()
            } as ChatMsg)
        },
    },
    persist: {
        key: 'ChatMsg', // 修改存在缓存中的key值
        paths: ['chatMap', 'currentChat']
    }
})