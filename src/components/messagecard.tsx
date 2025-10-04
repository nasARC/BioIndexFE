import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { Image } from '@heroui/image'
import Markdown from './markdown'
import { useMemo } from 'react'
import { Button } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@heroui/dropdown'
import { DynamicIcon } from 'lucide-react/dynamic'
import Seperator from './seperator'
import { useSpring, motion } from 'framer-motion'

interface MessageCardProps {
  sender: string
  timestamp?: string
  imageSrc: string
  content: string
  type: 'request' | 'response'
  onRemove: () => void
}

export default function MessageCard (props: MessageCardProps) {
  const timeReadable = useMemo(() => {
    if (!props.timestamp) return undefined
    return new Date(props.timestamp).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  }, [props.timestamp]);

    const tilt = useSpring(0);
    const tiltInverse = useSpring(0);

  return (
    <Card
      className={`${
        props.type === 'response' ? 'ml-2' : 'ml-auto mr-2'
      } max-w-160 w-max mt-2 rounded-3xl border-1 border-border bg-mozaic-30 backdrop-blur-xl backdrop-saturate-200 shadow-sm`}
    >
      <CardHeader className='pb-0'>
        <Image
          alt='nextui logo'
          height={40}
          radius='sm'
          src={props.imageSrc}
          width={40}
        />
        <div
          className={`flex flex-col ml-2 ${
            props.type === 'request' ? 'mr-4' : ''
          }`}
        >
          <p className='text-md'>{props.sender}</p>
          {props.timestamp && (
            <p className='text-small text-default-500'>{timeReadable}</p>
          )}
        </div>
        {props.type === 'request' && (
          <Dropdown className='bg-background'>
            <DropdownTrigger>
              <Button isIconOnly size='sm' className='ml-auto bg-transparent'>
                <DynamicIcon name='ellipsis-vertical' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu className='bg-background'>
              <DropdownItem
                color='danger'
                key='del'
                className='mx-auto'
                onPress={props.onRemove}
                onHoverStart={() => {
                    tilt.set(10);
                    tiltInverse.set(-10 * 0.25);
                }}
                onHoverEnd={() => {
                    tilt.set(0);
                    tiltInverse.set(0);
                }}
              >
                <div className='flex-row flex items-center'>
                  <motion.div
                    style={{
                        rotate: tilt
                    }}
                  >
                    <DynamicIcon name='trash' className='mr-2' />
                  </motion.div>
                  <motion.div
                    style={{
                        rotate: tiltInverse
                    }}
                  >
                    <p className='text-sm'>Delete Message</p>
                  </motion.div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>
      <Seperator className='mt-1' />
      <Skeleton
        className='m-0 min-h-16 pt-1'
        classNames={{ base: 'after:!bg-transparent !bg-transparent' }}
        isLoaded={!!props.content && props.content !== 'loading'}
      >
        <CardBody className='pt-0'>
          <Markdown>
            {props.content === 'loading' ? '' : props.content}
          </Markdown>
        </CardBody>
      </Skeleton>
    </Card>
  )
}
