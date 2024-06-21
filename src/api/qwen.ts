import {fetchStreamedData} from "./request";
import {useEventSource} from "@vueuse/core";

export const sendQwen = async (param: QwenParams) => {
    const sk = 'sk-43e3f0a374c64e1ca2929fb827de80f1'

    return await fetchStreamedData('/api/v1/apps/309647a49d2c4f10ae87f4e9a086631b/completion', {
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
