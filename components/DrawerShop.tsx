'use client'
import React from 'react'
import { Drawer, DrawerContent } from './ui/drawer'
import { cn } from '@/lib/utils'
import { linksAsideShop } from '@/data'
import Icon from './Icon'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { useShopStore } from '@/stores/shopStore'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const DrawerShop = () => {
  const {openAside, setOpenAside} = useShopStore((state) => ({openAside: state.openAside, setOpenAside: state.setOpenAside}))
  const pathname = usePathname()

  const isActived = (href: string) => pathname === href

  return (
    <div>
      <Drawer direction="left" open={openAside} onOpenChange={setOpenAside}>
        <DrawerContent className="h-screen top-0 left-0 right-auto mt-0 w-80 rounded-none flex flex-col">
          <div className="p-3 flex-1">
            <div className="py-6 ">
              <h1 className="text-4xl font-semibold text-center">LOGO</h1>
            </div>
            <div className="space-y-3">
              <h2 className="uppercase text-muted-foreground">MAIN MENU</h2>
              <div className="space-y-3">
                {linksAsideShop.map((el, i) => (
                  <Link
                    onClick={() => setOpenAside(false)}
                    className={cn(
                      'px-3 h-12 rounded-lg hover:bg-accent transition ease-linear w-full space-x-3 flex justify-start',
                      isActived(el.link) && 'bg-secondary font-bold'
                    )}
                    href={el.link}
                    key={i}
                  >
                    <li
                      className={cn(
                        'uppercase text-sm flex items-center space-x-3'
                      )}
                    >
                      <Icon name={el.icon} />
                      <span>{el.title}</span>
                    </li>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 border-t ">
            <Button className="h-12 p-3 w-full space-x-3" variant={'outline'} onClick={() => signOut()}>
              <LogOut />
              <span>Log Out</span>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default DrawerShop
