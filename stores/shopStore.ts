import { ProductsOnCart } from '@prisma/client'
import {create} from 'zustand'

type ShopState = {
  openAside: boolean,
  openCart: boolean,
  setOpenAside: (open: boolean) => void,
  setOpenCart: (open: boolean) => void,
  
}

type CartState = {
  productsOnCart: ProductsOnCart[],
  total: number,
  setProductsOnCart: (productsOnCart:ProductsOnCart[]) => void,
  setTotal: (total: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  productsOnCart: [],
  setProductsOnCart: (productsOnCart) => set({productsOnCart}),
  total:0,
  setTotal: (total) => set({total})
}))

export const useShopStore = create<ShopState>((set) => ({
  openAside: false,
  openCart: false,
  setOpenAside: (open) => set({openAside: open}),
  setOpenCart: (open) => set({openCart: open}),
}))