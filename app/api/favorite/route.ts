import {
  AddFavoriteParamsAPI,
  AddFavoriteParamsAPIType,
  RemoveFavoriteParamsAPI,
  RemoveFavoriteParamsAPIType,
} from '@/Schemas/Schemas'
import { getUser } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function GET(req: NextRequest) {
  try {
    let session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const favorites = await prisma?.favorites.findMany({
        where: { userId: user.id },
        include: {
          product: {
            select: {
              id: true,
              CategoryId: true,
              category: true,
              code: true,
              images: true,
              name: true,
              sellPrice: true,
            },
          },
        },
      })
      return NextResponse.json(favorites)
    }
  } catch (error) {
    console.log(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    let session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const data: AddFavoriteParamsAPIType = await req.json()
      AddFavoriteParamsAPI.safeParse(data)
      const result = await prisma?.favorites.findFirst({
        where: {
          AND: [
            {
              productId: data.productId,
            },
            {
              userId: user.id,
            },
          ],
        },
      })
      if (result === null || result === undefined) {
        await prisma?.favorites.create({
          data:{
            productId: data.productId,
            userId: user.id
          }
        })
        return NextResponse.json({message: 'Product Added to Favorites'})
      }
      return NextResponse.json({message: 'Product Added to Favorites'})
    }
  } catch (error) {
    if(error instanceof ZodError){
      return NextResponse.json({ message: 'invalid req' }, { status: 400 })
    }
    console.log(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    let session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const data: RemoveFavoriteParamsAPIType = await req.json()
      RemoveFavoriteParamsAPI.safeParse(data)
      await prisma?.favorites.delete({
        where: {
          id: data.id
        }
      })
      return NextResponse.json({message: 'Product Removed to Favorites'})
    }
  } catch (error) {
    if(error instanceof ZodError){
      return NextResponse.json({ message: 'invalid req' }, { status: 400 })
    }
    console.log(error)
  }
}
