import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatBot from 'react-chatbotify'

export default function ArticlePage () {
  const searchParams = useSearchParams()
  const id = searchParams[0].get('id') || ''

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)

      try {
        //
      } catch (err) {
        setError(err as Error)
      }

      setLoading(false)
    }

    fetchArticle()
  }, [id])

  const bgColor = '#121212';

  return (
    <>
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
            scale: '2',
          },
          chatButtonStyle: {
            background: bgColor,
            border: '1px solid #364049',
          },
          chatIconStyle: {
            width: "70%",
            height: "70%",
          },
          toastPromptContainerStyle: {
            background: bgColor,
          },
          toastPromptStyle: {
            background: bgColor,
          },
          chatHistoryButtonStyle: {
            background: bgColor,
          }
        }}
        settings={{
          general: {
            embedded: false,
            showHeader: true,
            showFooter: false
          },
          chatHistory: {
            storageKey: `article-${id}-chat-history`,
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
            closeChatIcon: 'cross.svg',
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
              const result = null;
              if (!result)
                return "I'm sorry, I couldn't fetch a response at this time.";
              let text = '';
              let offset = 0;
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
                for (let i = offset; i < chunkText.length; i++) {
                  await params.streamMessage(text.slice(0, i + 1));
                  await new Promise(resolve => setTimeout(resolve, 30));
                }
                offset += chunkText.length;
              }

              for (let i = offset; i < text.length; i++) {
                await params.streamMessage(text.slice(0, i + 1));
                await new Promise(resolve => setTimeout(resolve, 30));
              }
              await params.streamMessage(text);

              //@ts-expect-error library issue
              await params.endStreamMessage();
            },
            path: 'loop'
          }
        }}
        themes={[{ id: 'terminal', version: '0.1.0' }]}
      />
    </>
  )
}
