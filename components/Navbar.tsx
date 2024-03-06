'use client'
import React from 'react'
import { Button } from './ui/button'
import Icon from './Icon'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader } from 'lucide-react'

const Navbar = () => {
  const router = useRouter()
  const {data, status} = useSession()
  if(status == 'loading'){
    return <div className='h-16 flex justify-center items-center  '>
      <Loader className='animate-spin'/>
    </div>
  }
  return (
    <div className="h-16 flex items-center justify-between p-3 px-4 border-b border-b-slate-600">
      <div className="space-x-3">
        <Button variant={'ghost'} size={'icon'} className="rounded-full" onClick={() => router.back()}>
          <Icon name="ArrowLeft" />
        </Button>
        <Button variant={'ghost'} size={'icon'} className="rounded-full hidden">
          <Icon name="Menu" />
        </Button>
      </div>
      <div className="space-x-3 flex items-center">
        
        <Avatar>
          <AvatarImage
            src={
              'https://i.pinimg.com/564x/a2/80/e2/a280e2a50bf6240f29b49a72875adee5.jpg'
            }
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <span>{data?.user?.name}</span>
      </div>
    </div>
  )
}

export default Navbar
