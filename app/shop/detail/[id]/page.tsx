'use client'
import FavoriteBtn from '@/components/FavoriteBtn'
import Loading from '@/components/Loading'
import QuantitySpin from '@/components/QuantitySpin'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetcher } from '@/lib/utils'
import { OnAdd, ProductExtended } from '@/types/Types'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

const DetailPage = ({ params }: { params: { id: string } }) => {
  const productId = params.id
  const {
    data: product,
    isLoading,
    error,
  } = useSWR<ProductExtended>('/api/product/search?id=' + productId, fetcher)
  const [value, setValue] = useState(1)

  const onAdd: OnAdd = async (data) => {
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

  

  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return <h1>product no found</h1>
  }
  if (product) {
    return (
      <>
        <Carousel>
          <CarouselContent>
            {product?.images.map((img) => (
              <CarouselItem key={img.id}>
                <div className="h-80 w-full">
                  <img
                    src={img.url}
                    alt={String(img.productId)}
                    className="object-cover object-center h-full w-full rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8">
          <h1 className="text-3xl">{product?.name}</h1>
          <span className="text-sm text-muted-foreground">{product?.code}</span>
        </div>
        <div className="mt-4">
          <span className="text-muted-foreground">Category</span>
          <h1>{product?.category.name}</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="mt-6">
            <p>{product?.description}</p>
          </div>
        </ScrollArea>
        <div className="border-t flex justify-between px-3 items-center">
          <QuantitySpin value={value} setValue={setValue} />
          <h1 className="text-4xl font-bold text-right my-2">
            <span className="text-lg text-muted-foreground">
              $ {product?.sellPrice.toFixed(1)}
            </span>
          </h1>
        </div>
        <div className="border-t flex gap-3 py-3">
          <FavoriteBtn productId={product.id} />
          <Button
            className="flex-1"
            onClick={() =>
              onAdd({
                productCode: product?.code,
                productId: product.id,
                productName: product.name,
                productPrice: product.sellPrice,
                quantity: value,
              })
            }
          >
            Add to Cart
          </Button>
        </div>
      </>
    )
  }
}

export default DetailPage
