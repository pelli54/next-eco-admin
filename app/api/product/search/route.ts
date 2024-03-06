import { getUser } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    let session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const searchParams = req.nextUrl.searchParams
      const q = searchParams.get('q')
      const id = searchParams.get('id')
      if (searchParams.size === 0) {
        return NextResponse.json({ message: 'req invalid' }, { status: 400 })
      }
      if (q !== undefined && q !== null && q !== '') {
        const filter = [
          {
            code: { contains: q },
          },
          {
            name: { contains: q },
          },
        ]
        const products = await prisma?.product.findMany({
          where: {
            OR: filter,
          },
          include: {
            images: true,
            category: true,

          },
        })
        if (!user.isAdmin) {
          const productsToClient = products?.map((prod) => {
            const { costPrice, ...rest } = prod
            return rest
          })
          return NextResponse.json(productsToClient)
        }
        return NextResponse.json(products)
      }else if(q === '') { 
        return NextResponse.json([])
      }
      if (
        id !== undefined &&
        id !== null &&
        id !== '' &&
        !Number.isNaN(Number(id))
      ) {

        const product = await prisma?.product.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            images: true,
            category: true,
          },
        })
        if(!product){
        return NextResponse.json({ message: 'req invalid' }, { status: 400 })
        }
        if (!user.isAdmin) {
          const { costPrice, ...rest } = product
          return NextResponse.json(rest)
        }
        return NextResponse.json(product)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
