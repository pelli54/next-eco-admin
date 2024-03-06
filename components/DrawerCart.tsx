'use client'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { Drawer, DrawerContent } from './ui/drawer'
import { Button } from './ui/button'
import ItemCart from './ItemCart'
import { ScrollArea } from './ui/scroll-area'
import { calculateTotaOfCart, fetcher } from '@/lib/utils'
import useSWR from 'swr'
import { Cart, ProductImage, ProductsOnCart } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { OnAdd, OnRemove } from '@/types/Types'
import { useCartStore, useShopStore } from '@/stores/shopStore'
import { useRouter } from 'next/navigation'

const DrawerCart = () => {
  const router = useRouter()
  const { openCart, setOpenCart } = useShopStore((state) => ({
    openCart: state.openCart,
    setOpenCart: state.setOpenCart,
  }))
  const { setProductsOnCart, setTotal, productsOnCart } = useCartStore((state) => ({
    setProductsOnCart: state.setProductsOnCart,
    setTotal: state.setTotal,
    productsOnCart: state.productsOnCart
  }))

  const { data, isLoading, mutate } = useSWR<{
    cart: Cart & { products: ProductsOnCart[] }
    imagesAtProduct: [ProductImage]
  }>('/api/cart', fetcher)

  const onAdd: OnAdd = async (data) => {
    try {
      const result = await axios.post('/api/cart', data)
      if (result.status == 200) {
        toast.success(result.data.message)
        mutate()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    }
  }
  const onRemove: OnRemove = async (data) => {
    try {
      const result = await axios.put('/api/cart', data)
      if (result.status == 200) {
        toast.success(result.data.message)
        mutate()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    }
  }

  useEffect(() => {
    if(data){
      setProductsOnCart(data?.cart.products)
      setTotal(calculateTotaOfCart(data?.cart.products))
    }
  },[data])

  const onOrder = () => {
    setOpenCart(false)
    router.push('/shop/checkout')
  }

  if (data) {
    const total = calculateTotaOfCart(data?.cart?.products||[])
    return (
      <div>
        <Drawer direction="right" open={openCart} onOpenChange={setOpenCart}>
          <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 rounded-none flex flex-col">
            <div className="p-3 border-b h-16">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Cart</h1>
                <span className="text-muted-foreground">
                  {productsOnCart.length} Products
                </span>
              </div>
            </div>
            <ScrollArea className="p-3 flex-1">
              <div className="space-y-3">
                {data?.cart?.products.length === 0 && (
                  <h1 className="text-lg text-center">
                    Don't have Products in Cart
                  </h1>
                )}
                {data?.cart.products.map((prod) => (
                  <ItemCart
                    onAdd={onAdd}
                    onRemove={onRemove}
                    product={prod}
                    imgUrl={
                      data.imagesAtProduct.filter(
                        (img) => img.productId === prod.productId
                      )[0].url
                    }
                    key={prod.id}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="border-t">
              {total > 0 && (
                <div className="py-3 px-6 space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Total</span>
                    <span>$ {total.toFixed(1)}</span>
                  </div>
                </div>
              )}

              <div className="p-3">
                <Button disabled={total === 0} className="w-full" onClick={onOrder}>
                  Order
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    )
  }
}

export default DrawerCart
