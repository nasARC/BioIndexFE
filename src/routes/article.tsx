import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatBot from 'react-chatbotify'
import { getFastAPI } from '../lib/api/fastAPI'
import { sidebarChat } from '../lib/fetch'
import Markdown from '../components/markdown'
import { ScrollShadow, Skeleton } from '@heroui/react'

interface Article {
  pmid: number
  title: string
  journal: string
  year: number
  abstract: string
  full_text: string
}

export default function ArticlePage () {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''

  const [session, setSession] = useState<string | null>(null)
  useEffect(() => {
    const fetchSession = async () => {
      const storedSession = localStorage.getItem(`chatbot-session-${id}`)
      if (storedSession) {
        setSession(storedSession)
      } else {
        const { data: newSession } = await getFastAPI().sidebarSession()
        localStorage.setItem(`chatbot-session-${id}`, newSession)
        setSession(newSession)
      }
    }

    fetchSession()
  }, [id])

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)

      try {
        const { data } = await getFastAPI().article({
          article_id: parseInt(id)
        })

        setArticle(data as unknown as Article);
      } catch (err) {
        setError(err as Error)
      }

      setLoading(true)
    }

    fetchArticle()
  }, [id])

  const bgColor = '#121212'

  return (
    <>
      <ScrollShadow className='w-[95%]'>
        {article && <Markdown>{article.full_text}</Markdown>}
      </ScrollShadow>
      <ChatBot
        styles={{
          chatWindowStyle: {
            background: bgColor,
            border: '1px solid #364049'
          },
          headerStyle: {
            background: bgColor,
            borderBottom: '1px dashed #364049'
          },
          bodyStyle: {
            background: bgColor
          },
          chatInputAreaStyle: {
            background: bgColor
          },
          chatInputContainerStyle: {
            background: bgColor
          },
          botBubbleStyle: {
            background: bgColor
          },
          userBubbleStyle: {
            background: bgColor
          },
          chatInputAreaFocusedStyle: {
            border: 'none',
            boxShadow: 'none'
          },
          closeChatIconStyle: {
            margin: 0,
            backgroundColor: 'transparent',
            backgroundImage: 'url(cross.svg)',
            scale: '2'
          },
          chatButtonStyle: {
            background: bgColor,
            border: '1px solid #364049'
          },
          chatIconStyle: {
            width: '70%',
            height: '70%'
          },
          toastPromptContainerStyle: {
            background: bgColor
          },
          toastPromptStyle: {
            background: bgColor
          },
          chatHistoryButtonStyle: {
            background: bgColor
          }
        }}
        settings={{
          general: {
            embedded: false,
            showHeader: true,
            showFooter: false
          },
          chatHistory: {
            storageKey: `${session}-chat-history`,
            autoLoad: false
          },
          chatWindow: {
            showScrollbar: false
          },
          botBubble: {
            simulateStream: true
          },
          chatButton: {
            icon: 'chatbot.svg'
          },
          emoji: {
            disabled: true
          },
          fileAttachment: {
            disabled: true
          },
          header: {
            title: 'BioIndex Assistant',
            closeChatIcon: 'cross.svg'
          },
          notification: {
            disabled: true
          },
          tooltip: {
            mode: 'START',
            text: 'Ask me anything about this article!'
          },
          voice: {
            disabled: true
          }
        }}
        flow={{
          start: {
            message: 'Hello! How can I assist you with this article?',
            path: 'loop'
          },
          loop: {
            message: async params => {
              if (!session)
                return 'Loading... please wait a moment and try again.'

              const response = await sidebarChat(
                params.userInput,
                session,
                parseInt(id)
              )
              if (!response.body)
                return "I'm sorry, I couldn't get a response. Please try again."

              const reader = response.body.getReader()
              const decoder = new TextDecoder('utf-8')

              let res = ''
              let offset = 0
              while (true) {
                const { done, value } = await reader.read()
                const val = decoder
                  .decode(value, { stream: true })
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line)
                  .map(line => JSON.parse(line))
                for (const chunk of val) {
                  res += chunk.payload || ''
                }
                if (done) break
                for (let i = offset; i < res.length; i++) {
                  await params.streamMessage(res.slice(0, i + 1))
                  await new Promise(resolve => setTimeout(resolve, 30))
                }
                offset = res.length
              }

              for (let i = offset; i < res.length; i++) {
                await params.streamMessage(res.slice(0, i + 1))
                await new Promise(resolve => setTimeout(resolve, 30))
              }
              await params.streamMessage(res)

              //@ts-expect-error library issue
              await params.endStreamMessage()
            },
            path: 'loop'
          }
        }}
        themes={[{ id: 'terminal', version: '0.1.0' }]}
      />
    </>
  )
}
