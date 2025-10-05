import { useCallback, useEffect, useMemo, useState } from 'react'
import { type RequestResponsePair } from '../lib/types'
import MessageCard from './messagecard'

interface MessageCardPairProps {
  pair: RequestResponsePair
  options: MessageCardOptions
  onRemove: () => void
}

interface MessageCardOptions {
  avatarUrl?: string | null
}

export default function MessageCardPair (props: MessageCardPairProps) {
  const { request, response, setResponse, timestamp } = props.pair
  const requestText = useMemo(() => request, [request])
  const [responseText, setResponseText] = useState('')

  const readStream = useCallback(
    async (
      stream: ReadableStream,
      callback: (v: string) => void,
      onDone: (v: string) => void
    ) => {
      const reader = stream.getReader()
      const decoder = new TextDecoder('utf-8')

      let res = ''
      let lastTool = ''
      while (true) {
        const { done, value } = await reader.read()
        const val = decoder
          .decode(value, { stream: true })
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .map(line => JSON.parse(line))
        for (const chunk of val) {
          if (chunk.type !== 'message') {
            if (lastTool !== chunk.payload) {
              res += `${res !== '' ? '\n\n' : ''}=> *${chunk.payload}*\n\n`
              lastTool = chunk.payload
            }
          } else {
            res += chunk.payload || ''
          }
        }
        if (done) {
          onDone(res)
          return
        }
        callback(res)
      }
    },
    []
  )

  useEffect(() => {
    if (typeof response !== typeof '') {
      //@ts-expect-error we already check the type above
      readStream(response, setResponseText, setResponse)
    } else {
      //@ts-expect-error we already check the type above
      setResponseText(response)
    }
  }, [response, readStream, setResponse])

  return (
    <>
      <MessageCard
        type='request'
        content={requestText}
        sender={'You'}
        timestamp={timestamp}
        imageSrc={'/user.png'}
        onRemove={props.onRemove}
      />
      <MessageCard
        type='response'
        content={responseText}
        sender='BioIndex Assistant'
        timestamp={timestamp}
        imageSrc={'/logotrans.png'}
        onRemove={props.onRemove}
      />
    </>
  )
}
