
declare global {
    type MsgId = string | number

    type DocReference = {
        images: string[],
        text: string
        index_id: string
        title: string
        doc_name: string
        doc_id: string
    }

    type ChatMsg = {
        id: MsgId,
        content: string,
        type: 'send' | 'receive',
        userMsgId?: MsgId,
        fetched?: boolean,
        docReferences?: DocReference[]
    }

    type ChatSessionState = {
        sessions: Record<string, ChatMsg[]>
        currentSession: string
        loading: boolean
        inputContent: string
    }

    // export const chatModels = ['qwen-max', 'qwen-pro', 'qwen-lite', 'qwen-turbo'] as const
    // type ChatModel = (typeof chatModels)[number]

    type ChatConfig = {
        id: string,
        name: string,
        appId: string,
        apiKey: string,
        apiBaseUrl: string,
        model: string,
        isDefault: boolean
    }
}
export {}