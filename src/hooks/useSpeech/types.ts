
export interface SpeechRecognitionOptios {
    lang?: string
    continuous?: boolean
    interimResults?: boolean
    onresult?: (content?: string) => void
}