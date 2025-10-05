import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatBot from 'react-chatbotify'
import { getFastAPI } from '../lib/api/fastAPI'
import { sidebarChat } from '../lib/fetch'

interface Article {
  pmid: number
  title: string
  abstract: string
  journal: string
  year: number
  url: string
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

  const [article, setArticle] = useState<Article>()
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await getFastAPI().article({
          article_id: parseInt(id)
        })

        setArticle(data as unknown as Article)
      } catch (err) {
        console.error(err)
      }
    }

    fetchArticle()
  }, [id])

  const bgColor = '#121212'

  return (
    <>
      {article && (
        <div className='w-full h-full p-8 overflow-y-auto'>
          <h1 className='text-4xl font-bold mb-4'>{article.title}</h1>
          <p className='text-sm text-gray-400 mb-2'>{article.journal}</p>
          <h2 className='text-2xl font-bold mb-2'>Abstract</h2>
          <p className='text-base whitespace-pre-line mb-1'>{article.abstract}</p>
          <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}`} className='text-primary underline text-xl' target='_blank'>
            View Full Article
          </a>
        </div>
      )}
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
                      res += `=> Tool: ${chunk.payload}\n`
                      lastTool = chunk.payload
                    }
                  } else {
                    res += chunk.payload || ''
                  }
                }
                if (done) break
                for (let i = offset; i < res.length; i++) {
                  await params.streamMessage(res.slice(0, i + 1))
                  await new Promise(resolve => setTimeout(resolve, 5))
                }
                offset = res.length
              }

              for (let i = offset; i < res.length; i++) {
                await params.streamMessage(res.slice(0, i + 1))
                await new Promise(resolve => setTimeout(resolve, 5))
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
