'use client'
import React from 'react'
import { linksAside } from '@/data'
import Icon from './Icon'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Aside = () => {
  const pathname = usePathname()

  const isActived = (href: string) => pathname === href
  return (
    <aside className="p-3 lg:w-80 md:w-20 border-r border-r-slate-600 h-screen space-y-8 float-left">
      <div className="h-16 flex items-center">
        <h1 className="text-3xl w-full font-semibold text-center">LOGO</h1>
      </div>
      <div>
        <div className="px-3 mb-3">
          <span className="text-muted-foreground hidden lg:block">
            MAIN MENU
          </span>
        </div>
        <ul>
          {linksAside.map((el, i) => (
            <Link
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
        </ul>
      </div>
    </aside>
  )
}

export default Aside
