'use client'
import CardProduct from '@/components/CardProduct'
import Loading from '@/components/Loading'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { fetcher } from '@/lib/utils'
import { OnAdd, ProductExtended } from '@/types/Types'
import { Category } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

const page = () => {
  const [currentCategory, setCurrentCategory] = useState('')
  const { data: productData, isLoading, mutate } = useSWR<ProductExtended[]>(
    '/api/product/searchByCategory?category='+currentCategory,
    fetcher
  )
  const { data: categoryData, isLoading: isLoadingCat } = useSWR<Category[]>(
    '/api/category',
    fetcher
  )

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
  if (isLoading || isLoadingCat) {
    return <Loading />
  }
  return (
    <>
      <div className=''>
        <SearchBar/>
      </div>
      <div className="mt-8">
        <h1 className="text-4xl font-light ">Categories</h1>
      </div>
      <ScrollArea className="mt-3 whitespace-nowrap ">
        <div className="py-3 space-x-1">
          <Button className="rounded-full" onClick={() => setCurrentCategory('')} variant={currentCategory==''?'default':'secondary'}>All</Button>
          {categoryData?.map((cat) => (
            <Button key={cat.id} className="rounded-full" variant={currentCategory===String(cat.id)?'default':'outline'} onClick={() => setCurrentCategory(String(cat.id))} >
              {cat.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {productData?.map((prod) => {
            return <CardProduct onAdd={onAdd} key={prod.id} product={prod}  />
          })}
        </div>
      </ScrollArea>
    </>
  )
}

export default page
