import { Input } from '@heroui/input'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SearchBy } from '../lib/types'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection
} from '@heroui/dropdown'
import { getFastAPI } from '../lib/api/fastAPI'

export default function HomePage () {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = decodeURIComponent(searchParams.get('q') || '')
  const by = (searchParams.get('by') as SearchBy) || SearchBy.title
  const p = parseInt(searchParams.get('p') || '1');
  const page = isNaN(p) || p < 1 ? 1 : p;

  const [selectedSearchBys, setSelectedSearchBys] = useState(new Set([by]))
  const selectedSearchBy = Array.from(selectedSearchBys)
    .join(', ')
    .replace(/_/g, '')
  useEffect(() => {
    setSearchParams({ q: query, by: selectedSearchBy, p: page.toString() })
  }, [selectedSearchBy, query, setSearchParams, page])


  const [results, setResults] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)

      try {
        const { data } = await getFastAPI().search({
          search_term: query,
          page_num: page,
          filter: selectedSearchBy
        })

        console.log(data)

        setResults(data);
      } catch (err) {
        setError(err as Error)
      }

      setLoading(false)
    }

    fetchSearchResults()
  }, [query, page])

  const navigate = useNavigate()
  const [search, setSearch] = useState(query)
  const [inputFocused, setInputFocused] = useState(false)

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(search)}&by=${selectedSearchBy}`)
  }

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
          endContent={
            <Dropdown className='bg-background'>
              <DropdownTrigger>
                <div className='ml-auto cursor-pointer hover:scale-110 transition-transform'>
                  <DynamicIcon name='filter' className='select-none' />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                className='bg-background'
                disallowEmptySelection
                selectedKeys={selectedSearchBys}
                //@ts-expect-error library issue
                onSelectionChange={setSelectedSearchBys}
                selectionMode='single'
              >
                <DropdownSection title='Search By'>
                  {Object.entries(SearchBy).map(([key, value]) => {
                    return (
                      <DropdownItem
                        key={value}
                        value={value}
                        className='capitalize'
                      >
                        {key}
                      </DropdownItem>
                    )
                  })}
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          }
        />
      </div>
      {search === '' || results.length === 0 ? (
        <></>
      ) : (
        <div className='flex flex-col items-center mb-2 mt-2 w-full'></div>
      )}
    </div>
  )
}
