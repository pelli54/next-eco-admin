'use clinet'
import React, { MouseEvent } from 'react'
import { Card } from './ui/card'
import { Product } from '@prisma/client'
import { OnAdd, ProductExtended } from '@/types/Types'
import { Button } from './ui/button'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FavoriteBtn from './FavoriteBtn'

const CardProductSearch = ({
  product,
  onAdd,
}: {
  product: ProductExtended
  onAdd: OnAdd
}) => {
  const router = useRouter()
  const addToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onAdd({
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      productPrice: product.sellPrice,
    })
  }

  return (
    <Card
      className="p-3"
      onClick={() => router.push('/shop/detail/' + product.id)}
    >
      <div className="flex gap-3">
        <div className="w-20 min-w-20 h-20 ">
          <img
            className="object-cover h-full w-full rounded-sm"
            src={product.images[0]?.url || ''}
            alt={product.name}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="w-full">
            <h1 className="text-lg">{product.name}</h1>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">
              $ {product.sellPrice.toFixed(1)}
            </span>
            <div className="space-x-3">
              <FavoriteBtn productId={product.id} />
              <Button size={'icon'} onClick={addToCart}>
                <ShoppingCart />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CardProductSearch
