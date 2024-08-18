import axios from "axios";

const request = axios.create({
    baseURL: '',
    timeout: 1000 * 60 * 3
})

export { request }

export async function fetchStreamedData(url: string, config?: RequestInit) {
    const response = await fetch(url, config);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.body?.getReader()
}