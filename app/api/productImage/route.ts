import { genFilter, getUser } from '@/lib/utils'
import { ProductImage } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

interface APIproductImgaPost {
  url: string
  productCode: string | number
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    if (!code || code === '') {
      return NextResponse.json(
        { message: 'Invalid Product Data' },
        { status: 400 }
      )
    }
    const productFound = await prisma?.product.findFirst({ where: { code } })
    if (!productFound) {
      let productImages: ProductImage[] = []
      return NextResponse.json(productImages)
    }
    const productImages = await prisma?.productImage.findMany({
      where: { productId: productFound.id },
    })
    return NextResponse.json(productImages)
  } catch (error) {
    console.log(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    let session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      if (!user.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
      }
      const data: APIproductImgaPost = await req.json()
      if (!data.url || !data.productCode) {
        return NextResponse.json({ message: 'Invalid Data' }, { status: 400 })
      }
      const productFound = await prisma?.product.findUnique({
        where: { code: String(data.productCode) },
      })
      if (!productFound) {
        return NextResponse.json(
          { message: 'Invalid Product Data' },
          { status: 400 }
        )
      }
      const result = await prisma?.productImage.create({
        data: {
          url: data.url,
          productId: Number(productFound.id),
        },
      })
      return NextResponse.json(result)
    }
  } catch (error) {
    console.log(error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      if (!user.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
      }
      const searchParams = req.nextUrl.searchParams
      const id = searchParams.get('id')
      if (!id || Number.isNaN(id)) {
        return NextResponse.json({ message: 'Invalid Data' }, { status: 400 })
      }
      const result = await prisma?.productImage.delete({
        where: { id: Number(id) },
      })
      return NextResponse.json(result)
    }
  } catch (error) {
    console.log(error)
  }
}
