'use client'
import DrawerCart from '@/components/DrawerCart'
import DrawerShop from '@/components/DrawerShop'
import Loading from '@/components/Loading'
import ShopNavbar from '@/components/ShopNavbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const {status} = useSession()
  
  
  if(status=== 'loading'){
    return <Loading/>
  }
  if(status === 'unauthenticated'){
    router.push('/login')
  }
  return (
    <div>
      <ShopNavbar  />
      <DrawerShop  />
      <DrawerCart />
      <div className="flex justify-center h-[calc(100vh-4rem)]">
        <div className="p-3 max-w-[30rem] w-full flex flex-col">{children}</div>
      </div>
    </div>
  )
}

export default Layout
