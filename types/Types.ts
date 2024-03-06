import { AddFavoriteParamsAPIType, AddToCartParamsAPIType, DeleteToCartParamsAPIType, RemoveFavoriteParamsAPIType, registerSchema } from "@/Schemas/Schemas";
import { Category, Product, ProductImage } from "@prisma/client";
import { z } from "zod";

export type RegisterParamsAPI = z.infer<typeof registerSchema>

export type ProductExtended = Product & {
  category: Category,
  images: ProductImage[]
}

export type OnAdd = (data: AddToCartParamsAPIType) => void
export type OnRemove = (data: DeleteToCartParamsAPIType) => void 
export type OnAddToFavorite = (data: AddFavoriteParamsAPIType) => void 
export type OnRemoveToFavorite = (data: RemoveFavoriteParamsAPIType) => void 