import React from 'react'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import { ProductsOnCart } from '@prisma/client'
import { OnAdd, OnRemove } from '@/types/Types'

const ItemCart = ({product,imgUrl, onAdd, onRemove}:{product:ProductsOnCart, imgUrl: string, onAdd: OnAdd, onRemove:OnRemove}) => {
  const {quantity , ...productDataToRemove} = product
  return (
    <div className="">
      <div className="flex gap-3">
        <div className="w-20 min-w-20 h-20 bg-white rounded-lg ">
          <img
            className="object-contain  h-full w-full rounded-sm"
            src={imgUrl}
            alt={product.productName}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="w-full">
            <h1 className="">{product.productName}</h1>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">$ {product.productPrice.toFixed(1)}</span>
            <div className="flex gap-3 items-center">
              <Button disabled={product.quantity == 0} variant={'ghost'} size={'icon'} className="rounded-lg" onClick={() => onRemove(productDataToRemove)}>
                <Minus />
              </Button>
              <span className="font-semibold">{product.quantity}</span>
              <Button variant={'ghost'} size={'icon'} className="rounded-lg" onClick={() => onAdd(product)} >
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemCart
