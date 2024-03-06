'use client'
import React from 'react'
import { Button } from './ui/button'
import { Menu, ShoppingBasket } from 'lucide-react'
import { useShopStore } from '@/stores/shopStore'

const ShopNavbar = () => {
  const {setOpenAside, setOpenCart} = useShopStore(
    (state) => ({ setOpenAside: state.setOpenAside, setOpenCart: state.setOpenCart})
  )


  return (
    <div className='flex justify-center h-16 bg-slate-600'>
      <div className='max-w-[30rem] w-full p-3 flex justify-between gap-3 items-center'>
        <div>
            <Button variant={'ghost'} size={'icon'} onClick={() => setOpenAside(true)}>
                <Menu/>
            </Button>
        </div>
        <div className='flex-1'>
            <span className='text-2xl font-semibold'>Home</span>
        </div>
        <div>
            <Button variant={'ghost'} size={'icon'} onClick={() => setOpenCart(true)}>
                <ShoppingBasket/>
            </Button>
        </div>
      </div>
    </div>
  )
}

export default ShopNavbar
