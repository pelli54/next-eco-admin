'use client'
import React, { MouseEvent } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Heart, ShoppingCart } from 'lucide-react'
import { OnAdd, OnAddToFavorite, ProductExtended } from '@/types/Types'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import FavoriteBtn from './FavoriteBtn'

const CardProduct =  ({product, onAdd }:{product: ProductExtended, onAdd: OnAdd, }) => {
  const router = useRouter()

  const onAddFavorite: OnAddToFavorite = async (data) => {
    try {
      const result = await axios.post('/api/cart', data)
      if (result.status == 200) {
        toast.success(result.data.message)
        
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    }
  }

  const addToCart = async (e: MouseEvent<HTMLButtonElement> ) => {
    e.stopPropagation()
    onAdd({
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      productPrice: product.sellPrice
    })
  }
  return (
    <div>
      <Card className='p-3 rounded-xl' onClick={() => router.push('/shop/detail/' + product.id)}>
          <div className='h-40 relative rounded-lg bg-white ' >
            <FavoriteBtn productId={product.id} className='rounded-full absolute right-1 top-1'  />
            <img className='object-contain rounded-lg w-full h-full' src={product.images[0]?.url || ''} alt={product.name} />
          </div>
          <div>
            <h1 className=''>{product.name}</h1>
            <div className='flex items-center justify-between'>
              <span className='text-xl font-semibold'>$ {product.sellPrice.toFixed(1)}</span>
              <Button size={'icon'} onClick={addToCart}>
                <ShoppingCart/>
              </Button>
            </div>
          </div>
        </Card>
    </div>
  )
}

export default CardProduct
