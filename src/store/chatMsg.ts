import { defineStore } from 'pinia'

export const useChatMsgStore = defineStore('chatMsg', {
    state: (): ChatMsgState => ({
        chatMap: {
            default: []
        },
        currentChat: 'default',
        loading: false
    }),
    getters: {
        msgList: ({ chatMap, currentChat }) => chatMap[currentChat],
        sending: ({ loading }) => loading,
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
        getUserMsg(id: MsgId) {
            console.log('id -->',  id)
            console.log('this.chatMap[this.currentChat] ---> ', this.chatMap[this.currentChat])
            return this.chatMap[this.currentChat].find(msg => msg.id === id)
        },
        addUserMsg(content: string, id?: MsgId) {
            this.loading = true
            !this.chatMap[this.currentChat] && (this.chatMap[this.currentChat] = [])
            const _id = id || Math.random().toString(36).slice(2)
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
            const { id } = msg
            this.chatMap[this.currentChat] = this.chatMap[this.currentChat].map(item => item.id = msg.id ? msg : item)
        },
        addEmptyRobotMsg(forMsgId: MsgId) {
            !this.chatMap[this.currentChat] && (this.chatMap[this.currentChat] = [])
            this.chatMap[this.currentChat].push({
                type: 'receive',
                content: '',
                userMsgId: forMsgId,
                fetched: false,
                id: Math.random().toString(36).slice(2)
            } as ChatMsg)
        },
        async addRobotMsg(content: string, forMsgId: MsgId, id?: MsgId) {
            !this.chatMap[this.currentChat] && (this.chatMap[this.currentChat] = [])
            this.chatMap[this.currentChat].push({
                type: 'receive',
                content,
                userMsgId: forMsgId,
                id: id || Math.random().toString(36).slice(2)
            } as ChatMsg)
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'ChatMsg', // 修改存在缓存中的key值
                storage: localStorage, /// 修改存储方式为localStorage，默认sessionStorage
            }
        ],
        paths: ['chatMap', 'currentChat']
    }
})