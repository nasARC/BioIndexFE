import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSpring } from 'framer-motion'
import { motion } from 'framer-motion'
import type { RequestResponsePair } from '../lib/types'
import { ScrollShadow } from '@heroui/scroll-shadow'
import MessageCardPair from '../components/cardpair'

export default function HomePage () {
  const messageContRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<RequestResponsePair[]>([]);
  const [loaded, setLoaded] = useState(false);
  const msgValue = useMemo(() => JSON.stringify(messages), [messages]);
  useEffect(() => {
    const retrieveMessages = () => {
      const demoMessages = localStorage.getItem('demoMessages');
      setMessages(demoMessages ? JSON.parse(demoMessages) : []);
      setLoaded(true);
    };

    retrieveMessages();
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem('demoMessages', msgValue);
  }, [msgValue, loaded]);

  const sendMessage = useCallback(async (message: string) => {
    /*
    if (!message) return
    const now = new Date().toISOString()
    const tempId = crypto.randomUUID()
    const msgTemp = {
      id: tempId,
      request: message,
      response: 'loading',
      timestamp: now,
      setResponse: () => {}
    }
    setMessages(ms => [...ms, msgTemp])
    const response = await askDemo(message)
    if (!response.body) return
    let mid = response.headers.get('message_id')
    if (mid) mid = decodeURIComponent(mid)
    if (!mid || mid === 'error') mid = tempId
    let ursp = response.headers.get('user_message')
    if (ursp) ursp = decodeURIComponent(ursp)
    if (!ursp) ursp = message
    const stream = response.body

    const msg = {
      id: mid,
      request: ursp,
      response: stream,
      timestamp: now,
      setResponse: (r: string) => {
        setMessages(ms =>
          ms.map(m => {
            if (m.id === mid) {
              return {
                ...m,
                response: r
              }
            }
            return m
          })
        )
      }
    } as RequestResponsePair
    setMessages(ms =>
      ms.map(m => {
        if (m.id === tempId) {
          return msg
        }
        return m
      })
    )
      */
  }, [])

  // auto scroll to bottom
  useEffect(() => {
    const div = messageContRef.current
    if (div) {
      div.scrollTop = div.scrollHeight
      const lc = div.lastChild
      if (lc) {
        new ResizeObserver(() => {
          div.scrollTop = div.scrollHeight
        }).observe(lc as Element)
      }
    }
  }, [messages.length, messageContRef])

  const [message, setMessage] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const rotate = useSpring(0)

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <ScrollShadow
        ref={messageContRef}
        id='msgWndw'
        className='mx-auto my-2 w-[99%] h-[99%] overflow-auto'
      >
        {messages.map(message => {
          return (
            <MessageCardPair
              key={message.id}
              pair={message}
              options={{}}
              onRemove={() => {
                setMessages(ms => ms.filter(m => m.id !== message.id))
              }}
            />
          )
        })}
        <div className='h-6' />
      </ScrollShadow>
      <div
        className={`max-w-160 w-[95%] mt-auto mb-2 ${
          inputFocused ? 'border-primary' : 'border-border'
        } border-1 rounded-4xl`}
        style={{
          transition: 'border 300ms'
        }}
      >
        <Input
          value={message}
          onValueChange={setMessage}
          className={`w-full rounded-4xl mx-auto`}
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: [
              '!bg-transparent',
              'text-black/90 dark:text-white/90',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60 placeholder:select-none'
            ],
            innerWrapper: '!bg-transparent',
            inputWrapper: '!bg-transparent my-1',
            helperWrapper: '!bg-transparent',
            mainWrapper: ['!bg-transparent', 'cursor-text!', 'px-3']
          }}
          placeholder='Type your message...'
          radius='lg'
          endContent={
            <Button
              isIconOnly
              className='bg-primary rounded-full p-2 -mr-5'
              onMouseEnter={() => rotate.set(45)}
              onMouseLeave={() => rotate.set(0)}
              onPress={() => sendMessage(message)}
            >
              <motion.div
                style={{
                  rotateX: rotate,
                  rotateZ: -90
                }}
              >
                <DynamicIcon name='send-horizontal' />
              </motion.div>
            </Button>
          }
          onFocusChange={setInputFocused}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              sendMessage(message)
            }
          }}
        />
      </div>
    </div>
  )
}
