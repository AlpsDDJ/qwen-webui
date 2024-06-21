import {fetchStreamedData} from "./request";
import {useEventSource} from "@vueuse/core";
import {useChatSessionStore} from "@/store/ChatSession";

export const sendQwen = async (param: QwenParams) => {
    const {model} = useChatSessionStore()
    if(!model) {
        console.warn('模型不可为空')
        window.$message.error('模型不可为空')
    }
    const sk = model?.apiKey
    const url = model?.apiBaseUrl
    const _url = url.replace(/{\s*(.*?)\s*}/g, (_, objKey: keyof typeof model) => {
        const val = model[objKey]
        if (val === undefined) {
            throw new Error(`${config.url} 缺少参数: [${objKey.toString()}]`)
        }
        // 删除URL中匹配的参数
        // delete data[objKey]
        return encodeURIComponent(val as any)
    })

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
        message?: RoleMessage[]
    },
    parameters: any,
    debug: any
}
