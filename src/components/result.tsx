import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Image } from '@heroui/image'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/dropdown'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useSpring, motion } from 'framer-motion'

interface SearchResultProps {
  url: string
  name: string
  title: string
  date: string
  description: string
  icon: string
}

export default function SearchResult ({
  url,
  name,
  title,
  date,
  description,
  icon
}: SearchResultProps) {
    const tilt = useSpring(0);
    const tiltInverse = useSpring(0);

  return (
    <Card className='w-[95%] max-w-160 rounded-3xl border-1 border-border bg-mozaic-30 backdrop-blur-xl backdrop-saturate-200 shadow-sm'>
      <CardHeader className='pb-0 max-w-full overflow-hidden'>
        <Image alt={name} height={50} radius='sm' src={icon} width={50} />
        <div className='flex flex-col max-w-[85%]'>
          <p className='text-md text-ellipsis overflow-hidden text-nowrap'>{name}</p>
          <p className='text-small text-default-500 text-ellipsis overflow-hidden text-nowrap max-w-full'>{url}</p>
        </div>
        <Dropdown className='bg-background'>
          <DropdownTrigger>
            <Button isIconOnly size='sm' className='ml-auto bg-transparent'>
              <DynamicIcon name='ellipsis-vertical' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu className='bg-background'>
            {/* @ts-expect-error this is done intentionally */}
            <DropdownItem color=""
                key='copy' 
                onPress={() => {
                  navigator.clipboard.writeText(url);
                }}
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
                    <DynamicIcon name='copy' className='mr-2' />
                </motion.div>
                <motion.div
                    style={{
                        rotate: tiltInverse
                    }}
                >
                    <p className='text-sm'>Copy Link</p>
                </motion.div>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody className='pt-0 overflow-hidden'>
        <a
          href={url}
          target='_blank'
          className='text-2xl font-[500] text-blue-500 underline w-min overflow-hidden text-ellipsis max-w-full text-nowrap'
        >
          {title}
        </a>
        <p className='text-lg font-normal text-wrap break-words'>
          <span className='text-default-400'>{date} — </span>
          {description}
        </p>
      </CardBody>
    </Card>
  )
}
