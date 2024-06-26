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

// type RoleMessage = {
//     role: string,
//     content: string
// }

export type QwenParams = {
    input: {
        prompt?: string,
        // message?: RoleMessage[],
        session_id?: string,
    },
    parameters: any,
    debug: any
}

export interface QwenRespData {
    output: {
        session_id: string;
        finish_reason: string | null | 'stop';
        text: string;
        doc_references: Array<{
            doc_id: string,
            doc_name: string,
            index_id: string,
            text: string,
            title: string,
            images: string[]
        }>
    };
    usage: {
        models: Array<{
            input_tokens: number;
            output_tokens: number;
            model_id: string;
        }>;
    };
    request_id: string;
}

export class QwenSSELoader {
    declare onMessage: (resp: QwenRespData['output'], displayedText: string) => void

    declare onDone: (displayedText: string, sessionId: string) => void

    declare onConnection: () => void
    declare onError: (error: Error) => void

    getHttpParams = (params: QwenParams) => {
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
        sessionId && (params.input.session_id = sessionId)
        return {
            url: _url,
            sk,
        }
    }

    send = async (params: QwenParams, config?: RequestInit) => {
        let displayedText: string = ''
        let sessionId : string = ''
        const {url, sk} = this.getHttpParams(params)

        const reader = await fetchStreamedData(url, {
            ...config,
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                "X-DashScope-SSE": 'enable',
                Authorization: `Bearer ${sk}`,
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.warn('QwenSSELoader FetchError: ', error)
            this?.onError(error)
        })
        this.onConnection?.()

        while (true) {
            const {done, value} = await reader!.read();
            if (done) {
                // typing.value = false;
                // Object.assign(props.msg, {content: displayedText.value})
                this.onDone?.(displayedText, sessionId)
                break;
            }
            const chunkText = new TextDecoder().decode(value);
            for (const splitText of chunkText.split('\n')) {
                if (splitText.startsWith('data:')) {
                    let jsonData: QwenRespData | undefined = undefined
                    try {
                        jsonData = <QwenRespData>JSON.parse(splitText.substring(5))
                    } catch (error) {
                        console.warn('QwenSSELoader JsonParseError: ', error)
                        this?.onError(error as Error)
                    }
                    if(jsonData) {
                        const {text, finish_reason, session_id} = jsonData.output || {}
                        sessionId ??= session_id
                        if (finish_reason !== 'stop') {
                            displayedText += text;
                        }
                        this.onMessage?.(jsonData.output, displayedText)
                    }
                }
            }
        }
        return displayedText
    }

    // constructor(params: P, config?: RequestInit) {
    //     this.params = params
    //     config && (this.httpConfig = config)
    // }
}