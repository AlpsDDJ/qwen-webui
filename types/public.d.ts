export {}
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

    type ChatMsgState = {
        chatMap: Record<string, ChatMsg[]>
        currentChat: string
        loading: boolean
        inputContent: string
    }
}