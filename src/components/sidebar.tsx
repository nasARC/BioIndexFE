import { Button } from '@heroui/button'
import { motion, useSpring } from 'framer-motion'
import { useMemo, useState } from 'react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { useNavigate } from 'react-router-dom'
import { useScreenSize } from '../lib/hooks'

interface SidebarProps {
  pathname: string
}

export default function Sidebar (props: SidebarProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const screensize = useScreenSize()
  const { wOpen, wClosed } = useMemo(() => {
    return {
      wOpen:
        screensize.width >= 1024
          ? '25%'
          : screensize.width >= 800
          ? '30%'
          : screensize.width >= 640
          ? '40%'
          : screensize.width >= 500
          ? '55%'
          : screensize.width >= 375
          ? '65%'
          : '80%',
      wClosed:
        screensize.width >= 1024
          ? '7%'
          : screensize.width >= 768
          ? '10%'
          : screensize.width >= 640
          ? '12%'
          : '15%'
    }
  }, [screensize.width])

  const SideBarButton = ({
    path,
    to,
    name,
    icon
  }: {
    path: string[]
    to: string | null
    name: string
    icon: IconName
  }) => {
    const tilt = useSpring(0)
    const tiltInverse = useSpring(0)

    return (
      <motion.div
        className='w-full flex flex-col items-center my-1'
        onHoverStart={() => {
          tilt.set(15)
          tiltInverse.set(-15 * 0.25)
        }}
        onHoverEnd={() => {
          tilt.set(0)
          tiltInverse.set(0)
        }}
      >
        <Button
          className={`h-9 w-[85%] ${
            isOpen ? 'justify-start hover:scale-105' : 'hover:scale-110'
          } bg-transparent ${
            path.includes(window.location.pathname)
              ? 'border-border border-1'
              : 'border-border-transparent border-0'
          }`}
          style={{
            transition: 'border 300ms'
          }}
          isIconOnly={!isOpen}
          onPress={() => {
            if (to) navigate(to);
          }}
        >
          {isOpen ? (
            <>
              <motion.div
                style={{
                  rotate: tilt
                }}
                className='flex flex-row items-center'
              >
                <DynamicIcon name={icon} />
              </motion.div>
              <motion.div
                style={{
                  rotate: tiltInverse
                }}
                className='flex flex-row items-center'
              >
                <p className='ml-0'>{name}</p>
              </motion.div>
            </>
          ) : (
            <DynamicIcon name={icon} />
          )}
        </Button>
      </motion.div>
    )
  }

  return (
    <>
      {screensize.width < 768 && (
        <div className='h-full' style={{ minWidth: wClosed }} />
      )}
      <motion.div
        className={`w-[${wOpen}] h-full top-0 left-0 z-50 flex flex-col items-center justify-start md:relative fixed border-r-1 border-border bg-mozaic-30`}
        variants={{
          open: { width: wOpen, x: 0 },
          closed: { width: wClosed, x: 0 }
        }}
        initial={{ x: '-100%' }}
        animate={isOpen ? 'open' : 'closed'}
        exit={{ x: '-100%' }}
        transition={{
          type: 'keyframes',
          ease: 'easeInOut',
          duration: 0.4
        }}
      >
        <div className='mt-6 relative w-full flex mb-1 select-none'>
          {isOpen ? (
            <img src='/logotext.png' className='w-50 m-auto' />
          ) : (
            <div className='m-auto'>
              <img src='/logotrans.png' className='w-10' />
            </div>
          )}
          <motion.div
            variants={{
              open: {
                rotate: 180,
                left: '100%',
                top: 0,
                translateX: '-50%',
                position: 'absolute'
              },
              closed: {
                rotate: 0,
                left: '100%',
                top: 0,
                translateX: '-50%',
                position: 'absolute'
              }
            }}
            initial={{
              rotate: 0,
              left: '100%',
              top: 0,
              translateX: '-50%',
              position: 'absolute'
            }}
            animate={isOpen ? 'open' : 'closed'}
            exit={{
              rotate: 0,
              left: '100%',
              top: 0,
              translateX: '-50%',
              position: 'absolute'
            }}
            transition={{
              duration: 0.4,
              type: 'keyframes',
              ease: 'linear'
            }}
          >
            <Button
              isIconOnly
              size='sm'
              onPress={() => setIsOpen(o => !o)}
              className='border-1 border-border bg-mozaic'
            >
              <DynamicIcon name={'chevrons-right'} />
            </Button>
          </motion.div>
        </div>
        <SideBarButton
          path={['/', '/search']}
          to={props.pathname === '/search' ? null : '/'}
          name={props.pathname === '/search' ? 'Search' : 'Home'}
          icon={props.pathname === '/search' ? 'search' : 'home'}
        />
        <SideBarButton path={['/about']} to='/about' name='About' icon='info' />
        <SideBarButton
          path={['/chat']}
          to='/chat'
          name='Chatbot'
          icon='message-circle'
        />
      </motion.div>
    </>
  )
}
