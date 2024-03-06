'use client'
import CardProductSearch from '@/components/CardProductSearch'
import Loading from '@/components/Loading'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { fetcher, onAdd } from '@/lib/utils'
import { OnAdd, ProductExtended } from '@/types/Types'
import axios, { AxiosError } from 'axios'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

const SearchPage = () => {
  const params = useSearchParams()
  const router = useRouter()
  if (!params.get('q') || params.get('q') === '') {
    //router.push('/shop/')
  }

  const {
    data: products,
    isLoading,
  } = useSWR<ProductExtended[]>(
    '/api/product/search?q=' + params.get('q'),
    fetcher
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <SearchBar />
      <div className="text-2xl mt-6">
        <span className="font-light">Results: </span>
        <span>{products?.length}</span>
      </div>
      <div className="space-y-3 mt-3">
        {products?.map((product) => (
          <CardProductSearch onAdd={onAdd} product={product} key={product.id} />
        ))}
      </div>
    </>
  )
}

export default SearchPage
