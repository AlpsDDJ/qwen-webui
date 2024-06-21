import {fetchStreamedData} from "./request";
import {useEventSource} from "@vueuse/core";
import {useChatSessionStore} from "@/store/ChatSession";

export const sendQwen = async (param: QwenParams) => {
    const {model, sessionId} = useChatSessionStore()
    if(!model) {
        window.$message.error('模型不可为空')
        throw new Error(`模型不可为空`)
    }
    const sk = model?.apiKey
    const url = model?.apiBaseUrl ?? ''
    const _url = url.replace(/{\s*(.*?)\s*}/g, (_, objKey) => {
        const val = model![objKey]
        if (val === undefined) {
            throw new Error(`模型缺少参数: [${objKey.toString()}]`)
        }
        return encodeURIComponent(val as any)
    })
    sessionId && (param.input.session_id = sessionId)

    return await fetchStreamedData(_url, {
        method: 'POST',
        body: JSON.stringify(param),
        headers: {
            // Accept: "text/event-stream",
            "X-DashScope-SSE": 'enable',
            Authorization: `Bearer ${sk}`,
            'Content-Type': 'application/json'
        }
    })
}

type RoleMessage = {
    role: string,
    content: string
}

export type QwenParams = {
    input: {
        prompt?: string,
        message?: RoleMessage[],
        session_id?: string,
    },
    parameters: any,
    debug: any
}
