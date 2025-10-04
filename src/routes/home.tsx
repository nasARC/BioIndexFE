import { Input } from '@heroui/input'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function HomePage () {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const handleSearch = () => {
    navigate(`/search?q=${search}`);
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <h1 className='font-black text-7xl text-primary-dark select-none'>BioIndex</h1>
      <div
        className={`max-w-160 w-[90%] ${
          inputFocused ? 'border-primary' : 'border-border'
        } border-1 rounded-4xl`}
        style={{
          transition: 'border 300ms'
        }}
      >
        <Input
          value={search}
          onValueChange={setSearch}
          isClearable
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
              'px-3',
            ],
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
    </div>
  )
}
