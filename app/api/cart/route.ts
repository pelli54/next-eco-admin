import {
  AddToCartParamsAPI,
  AddToCartParamsAPIType,
  DeleteToCartParamsAPI,
  DeleteToCartParamsAPIType,
} from '@/Schemas/Schemas'
import { getUser } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError, z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const cart = await prisma?.cart.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          products: true,
        },
      })
      const imagesAtProduct = await prisma?.productImage.findMany({
        where: {
          productId: {
            in: cart?.products.map((prod) => prod.productId),
          },
        },
      })
      return NextResponse.json({ cart, imagesAtProduct })
    }
  } catch (error) {}
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const productToCart: AddToCartParamsAPIType = await req.json()
      AddToCartParamsAPI.safeParse(productToCart)
      const cartUser = await prisma?.cart.findFirst({
        where: {
          userId: user.id,
          status: 'active',
        },
      })
      if (!cartUser) {
        const cartCreated = await prisma?.cart.create({
          data: {
            status: 'active',
            userId: user.id,
          },
        })
        if (cartCreated) {
          await prisma?.productsOnCart.create({
            data: {
              productCode: productToCart.productCode,
              productId: productToCart.productId,
              productName: productToCart.productName,
              productPrice: productToCart.productPrice,
              quantity: productToCart.quantity || 1,
              cartId: cartCreated?.id,
            },
          })
          return NextResponse.json({ message: 'product added' })
        }
      } else if (cartUser) {
        const productIsInCartFound = await prisma?.productsOnCart.findFirst({
          where: {
            productId: productToCart.productId,
            cartId: cartUser.id,
          },
        })
        if (!productIsInCartFound) {
          await prisma?.productsOnCart.create({
            data: {
              productCode: productToCart.productCode,
              productId: productToCart.productId,
              productName: productToCart.productName,
              productPrice: productToCart.productPrice,
              quantity: productToCart.quantity || 1,
              cartId: cartUser?.id,
            },
          })
          return NextResponse.json({ message: 'product added' })
        } else {
          await prisma?.productsOnCart.update({
            where: {
              id: productIsInCartFound.id,
            },
            data: {
              quantity: {
                increment: 1,
              },
            },
          })
          return NextResponse.json({ message: 'product added' })
        }
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'invalid product req' },
        { status: 400 }
      )
    }
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const productToDelete: DeleteToCartParamsAPIType = await req.json()
      DeleteToCartParamsAPI.safeParse(productToDelete)
      const productOnCartToDelete = await prisma?.productsOnCart.findFirst({
        where: {
          productId: productToDelete.productId,
          cartId: productToDelete.cartId,
        },
      })
      if (!productOnCartToDelete) {
        return NextResponse.json(
          { message: 'Product no exist in the cart' },
          { status: 400 }
        )
      }
      if (productToDelete.quantity) {
        if (productToDelete.quantity >= productOnCartToDelete.quantity) {
          await prisma?.productsOnCart.delete({
            where: {
              id: productOnCartToDelete.id,
            },
          })
          return NextResponse.json({ message: 'product deleted' })
        } else {
          await prisma?.productsOnCart.update({
            where: {
              id: productOnCartToDelete.id,
            },
            data: {
              quantity: {
                decrement: productToDelete.quantity,
              },
            },
          })
          return NextResponse.json({ message: 'product decremented' })
        }
      } else {
        if (productOnCartToDelete.quantity == 1) {
          await prisma?.productsOnCart.delete({
            where: {
              id: productOnCartToDelete.id,
            },
          })
          return NextResponse.json({ message: 'product deleted!' })
        } else {
          await prisma?.productsOnCart.update({
            where: {
              id: productOnCartToDelete.id,
            },
            data: {
              quantity: {
                decrement: 1,
              },
            },
          })
          return NextResponse.json({ message: 'product decremented!' })
        }
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'invalid req' }, { status: 400 })
    }
  }
}
