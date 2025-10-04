import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { useSpring } from 'framer-motion'
import { motion } from 'framer-motion'

export default function HomePage () {
  const [search, setSearch] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const handleSubmit = () => {};

  const rotate = useSpring(0);

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div
        className={`max-w-160 w-[90%] mt-auto mb-2 ${
          inputFocused ? 'border-primary' : 'border-border'
        } border-1 rounded-4xl`}
        style={{
          transition: 'border 300ms'
        }}
      >
        <Input
          value={search}
          onValueChange={setSearch}
          className={`w-full rounded-4xl mx-auto`}
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: [
              '!bg-transparent',
              'text-black/90 dark:text-white/90',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60'
            ],
            innerWrapper: '!bg-transparent',
            inputWrapper: '!bg-transparent my-1',
            helperWrapper: '!bg-transparent',
            mainWrapper: [
              'shadow-sm',
              'dark:bg-default/60',
              '!bg-mozaic',
              'backdrop-blur-xl',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focus=true]:bg-mozaic',
              'dark:group-data-[focus=true]:bg-default/60',
              'cursor-text!',
              'rounded-4xl',
              'px-3'
            ]
          }}
          placeholder='Type your message...'
          radius='lg'
          endContent={
            <Button
              isIconOnly
              className='bg-primary rounded-full p-2 -mr-5'
              onMouseEnter={() => rotate.set(45)}
              onMouseLeave={() => rotate.set(0)}
              onPress={handleSubmit}
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
              handleSubmit()
            }
          }}
        />
      </div>
    </div>
  )
}
