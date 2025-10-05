export type RequestResponsePair = {
    id: string,
    request: string,
    response: string | ReadableStream,
    setResponse: (r: string) => void,
    timestamp: string,
}

export enum SearchBy {
  title = "title",
  abstract = "abstract",
  conclusion = "conclusion"
}