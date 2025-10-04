import { Input } from '@heroui/input'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Kbd } from '@heroui/kbd'
import Seperator from '../components/seperator'

export default function HomePage () {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const handleSearch = () => {
    navigate(`/search?q=${search}`)
  }

  const [auto, setAuto] = useState<string[]>([])
  const [autoTimeout, setAutoTimeout] = useState<number>()
  const handleSearchChange = async (value: string) => {
    setSearch(value)
    setAuto(['a'])
    if (autoTimeout) clearTimeout(autoTimeout)

    const fetchAuto = async () => {}

    setAutoTimeout(setTimeout(fetchAuto, 1000))
  }

  return (
    <div className='w-full h-full flex flex-col justify-start items-center'>
      <h1 className='font-black text-8xl text-primary-dark select-none mt-[25%] mb-4'>
        BioIndex
      </h1>
      <div
        className={`max-w-160 w-[95%] ${
          inputFocused ? 'border-primary' : 'border-border'
        } border-1 rounded-3xl bg-mozaic-30 backdrop-blur-xl backdrop-saturate-200 shadow-sm`}
        style={{
          transition: 'border 300ms'
        }}
      >
        <Input
          value={search}
          onValueChange={handleSearchChange}
          isClearable
          className={`w-full`}
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
          placeholder='Type to search...'
          radius='lg'
          startContent={
            <motion.span
              initial={{ y: 0, transition: { duration: 0.1 } }}
              animate={inputFocused ? { y: [0, -8, 0, -4, 0] } : {}}
              exit={{ y: 0, transition: { duration: 0.1 } }}
              transition={{
                duration: 0.5,
                times: [0, 0.35, 0.65, 0.85, 1],
                ease: 'easeOut'
              }}
              style={{ display: 'inline-flex' }}
            >
              <DynamicIcon name='search' />
            </motion.span>
          }
          onFocusChange={setInputFocused}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        {search !== '' && auto.length > 0 && (
          <>
            <Seperator
              className={`mb-1 ${
                inputFocused ? 'border-primary' : 'border-border'
              }`}
            />
            <div className='flex flex-col items-center mb-2'>
              <p className='mt-3 select-none'>
                Press <Kbd keys={['enter']} /> to search
              </p>
            </div>
          </>
        )}
      </div>
      {(search === '' || auto.length === 0) && (
        <p className='mt-2 select-none'>
          Press <Kbd keys={['enter']} /> to search
        </p>
      )}
    </div>
  )
}
