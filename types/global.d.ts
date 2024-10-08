import type {MessageApiInjection} from "naive-ui/es/message/src/MessageProvider"

export {}

declare global {
    import type {MessageApiInjection} from "naive-ui/es/message/src/MessageProvider"
    declare interface Window {
        SpeechRecognition?: any;
        webkitSpeechRecognition?: any;
        $message: MessageApiInjection
    }
}
