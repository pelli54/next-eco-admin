'use client'
import CardProductSearch from '@/components/CardProductSearch'
import Loading from '@/components/Loading'
import Title from '@/components/Title'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetcher, onAdd } from '@/lib/utils'
import { ProductExtended } from '@/types/Types'
import { Favorites } from '@prisma/client'
import React from 'react'
import useSWR from 'swr'

const Page = () => {
  const {
    data: favorites,
    isLoading,
    error,
  } = useSWR<Array<Favorites & {product: ProductExtended}>>('/api/favorite', fetcher)
  if (isLoading) {
    return <Loading />
  }
  if (error) {
    console.log(error)
    return <h1>product no found</h1>
  }
  if (favorites) {
    return (
      <>
        <Title content={'My Favorite'} />
        <ScrollArea>
          <div>
            {
              favorites.length===0&&<h1 className='text-lg text-center'>Don't Have Favorites</h1>
            }
            {
              favorites.map(fav => (
                <CardProductSearch onAdd={onAdd} product={fav.product} key={fav.id} />
              ))
            }
            </div>
        </ScrollArea>
      </>
    )
  }
}

export default Page
