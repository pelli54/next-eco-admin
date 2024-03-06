import { ProductsOnCart } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const registerSchema = z
    .object({
        username: z.string().min(4),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'the passwords must be match',
        path: ['confirmPassword'],
    })

export const productSchema = z.object({
    code: z.string().min(4),
    name:z.string().min(4),
    description: z.string().optional(),
    costPrice: z.coerce.number().nonnegative(),
    sellPrice: z.coerce.number().nonnegative().positive(),
    categoryId: z.coerce.number().positive(),
})

export const imageFormSchema = z.object({
    urlImage: z.string().url()
})

export const AddToCartParamsAPI = z.object({
    productId: z.number(),
    productCode: z.string(),
    productName: z.string(),
    productPrice: z.number(),
    quantity: z.number().optional()
})

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const CheckoutFormSchema = z.object({
    isDelivery: z.boolean().default(true),
    nameClient: z.string().min(6),
    direction:z.string().min(8),
    contact: z.string().regex(phoneRegex, 'must be a phone number'),
    note: z.string().optional(),  
})

export type CheckoutFormSchemaType = z.infer<typeof CheckoutFormSchema>

export type AddToCartParamsAPIType = z.infer<typeof AddToCartParamsAPI>

export const DeleteToCartParamsAPI = z.object({
    cartId: z.number(),
    productId: z.number(),
    quantity: z.number().optional()
})

export type DeleteToCartParamsAPIType = z.infer<typeof DeleteToCartParamsAPI>

export const AddFavoriteParamsAPI = z.object({
    productId: z.number().nonnegative()
})

export type AddFavoriteParamsAPIType = z.infer<typeof AddFavoriteParamsAPI>

export const RemoveFavoriteParamsAPI = z.object({
    id: z.number().nonnegative()
})

export type RemoveFavoriteParamsAPIType = z.infer<typeof RemoveFavoriteParamsAPI>