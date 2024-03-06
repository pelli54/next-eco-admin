import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import prisma from '@/db/client'
import { NextResponse } from 'next/server'
import axios, { AxiosError } from 'axios'
import { Product, ProductsOnCart, ProductsOnOrder } from '@prisma/client'
import { OnAdd, ProductExtended } from '@/types/Types'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUser(email: string) {
  try {
    let userfound = await prisma.users.findUnique({ where: { email } })
    if (!userfound)
      return NextResponse.json({ message: 'unauthorized' }, { status: 403 })
    return userfound
  } catch (error) {
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}

export function fetcher(url: string) {
  return axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data)
}

export function genFilter({
  searchParams,
  keys,
}: {
  searchParams: URLSearchParams
  keys: string[]
}){
  //toma el primer parametro de searchParams y genera un objeto Filter para utilizarce para buscar un producto en la base de datos
  const filter = keys
    .filter((el) => searchParams.has(el))
    .filter((el) => el !== null)
    .map((key) => ({ [key]: searchParams.get(key) }))
    .map((el) => (el.id ? { id: Number(el.id) } : el))[0]
  if (Object.keys(filter).length == 0) {
    return NextResponse.json({ message: 'req invalid' }, { status: 400 })
  }
  return filter
}


export function excludeAtProduct(
  product: ProductExtended,
  keys: keyof Product
): Omit<Product, keyof Product> {
  return Object.fromEntries(
    Object.entries(product).filter(([key]) => !keys.includes(key))
  )
}

export const onAdd: OnAdd = async (data) => {
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

export async function onPost<T>(url: string, data: T) {
  try {
    const result = await axios.post(url, data, {
      withCredentials:true
    })
    if (result.status == 200) {
      toast.success(result.data.message)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message)
    }
  }
}

export function calculateTotaOfCart(productsOnCart: ProductsOnCart[] | ProductsOnOrder[]):number{
  const PriceToQuantity = productsOnCart.map(product => product.productPrice*product.quantity)
  const sum = PriceToQuantity.reduce((acc, ele) => acc+ele,0)
  return sum
}

export const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')