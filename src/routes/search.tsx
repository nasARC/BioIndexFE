import { Input } from '@heroui/input'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchResult from '../components/result'

export default function HomePage () {
  const searchParams = useSearchParams();
  const query = searchParams[0].get('q') || '';

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);

      try {
        //
      } catch (err) {
        setError(err as Error);
      }

      setLoading(false);
    }

    fetchSearchResults();
  }, [query]);


  const navigate = useNavigate();
  const [search, setSearch] = useState(query);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSearch = () => {
    navigate(`/search?q=${search}`);
  };

  return (
    <div className='w-full h-full flex flex-col justify-start items-center'>
      <div
        className={`max-w-160 w-[95%] ${
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
      </div>
      {/* @ts-expect-error will fix when types come */}
      {(search === "" || results.sites?.length === 0) ? (
        <></>
      ) : (
        <div className='flex flex-col items-center mb-2 mt-2 w-full'>
          
        </div>
      )}

    </div>
  )
}
