'use client'
import React, { MouseEvent } from 'react'
import { Button } from './ui/button'
import { Heart, Loader } from 'lucide-react'
import { OnAddToFavorite, OnRemoveToFavorite } from '@/types/Types'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import useSWR from 'swr'
import { Favorites } from '@prisma/client'
import { fetcher } from '@/lib/utils'
import Loading from './Loading'

const FavoriteBtn = ({ productId,className }: { productId: number, className?: string }) => {
  const {
    data: favorites,
    isLoading,
    error,
    mutate,
  } = useSWR<Favorites[]>('/api/favorite', fetcher)
  const onAddFavorite: OnAddToFavorite = async (data) => {
    try {
      const result = await axios.post('/api/favorite', data)
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
  const onRemoveFavorite: OnRemoveToFavorite = async (data) => {
    try {
      const result = await axios.put('/api/favorite', data)
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

  if (isLoading) {
    return <Loader className='animate-spin absolute' />
  }
  if (error) {
    console.log(error)
    return <h1>product no found</h1>
  }
  if (favorites) {
    const favorite = favorites.find((ele) => ele.productId == productId)
    const isFavorite = !!favorite
    const onClickFavorite = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      isFavorite
        ? onRemoveFavorite({ id: favorite.id })
        : onAddFavorite({ productId })
    }
    return (
      <Button variant={'ghost'} size={'icon'} onClick={onClickFavorite} className={className}>
        {isFavorite ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#f1565c"
            className="bi bi-suit-heart-fill"
            viewBox="0 0 16 16"
          >
            {' '}
            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />{' '}
          </svg>
        ) : (
          <Heart />
        )}
      </Button>
    )
  }
}

export default FavoriteBtn
