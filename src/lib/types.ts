export type RequestResponsePair = {
    id: string,
    request: string,
    response: string | ReadableStream,
    setResponse: (r: string) => void,
    timestamp: string,
}