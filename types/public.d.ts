declare global {
    type MsgId = string | number

    type ChatModelConfig = {
        id: string,
        name: string,
        appId: string,
        apiKey: string,
        apiBaseUrl: string,
        model: string,
        enabled: boolean,
        isDefault: boolean
    }

    type DocReference = {
        images: string[],
        text: string
        index_id: string
        title: string
        doc_name: string
        doc_id: string
    }

    type MessageStatus = 'local' | 'pending' | 'success' | 'error'
    type MessageType = 'send' | 'receive'

    type ChatMsg = {
        id: MsgId,
        content: string,
        status: MessageStatus,
        type: MessageType,
        userMsgId?: MsgId,
        // fetched?: boolean,
        docReferences?: DocReference[]
    }

    interface ChatSession {
        messages: ChatMsg[],
        name: string
        sessionId?: string
        chatConfig?: ChatModelConfig
        createTime: number
    }

    type ChatSessionState = {
        sessions: Record<string, ChatSession>
        currentSession: string
        // loading: boolean
        inputContent: string
    }

    // export const chatModels = ['qwen-max', 'qwen-pro', 'qwen-lite', 'qwen-turbo'] as const
    // type ChatModel = (typeof chatModels)[number]
}
export {}