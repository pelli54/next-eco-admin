import { CheckoutFormSchema, CheckoutFormSchemaType } from '@/Schemas/Schemas'
import { calculateTotaOfCart, getUser, zeroPad } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const params = req.nextUrl.searchParams
      const skip = Number(params.get('skip')) || 0
      const take = Number(params.get('take')) || 100
      const id = Number(params.get('id'))
      if (Number.isInteger(id) && id > 0) {
        const filter = user.isAdmin
          ? {
              id,
            }
          : {
              id,
              userId: user.id,
            }
        const order = await prisma?.orders.findFirst({
          where: filter,
          include: {
            products: true,
          },
        })
        return NextResponse.json(order)
      } else {
        
        if (user.isAdmin) {
          const orders = await prisma?.orders.findMany({
            take,
            skip,
            include: {
              products: true,
            },
            orderBy:{
              id: 'desc'
            }
          })
          return NextResponse.json(orders)
        } else {
          const orders = await prisma?.orders.findMany({
            take,
            skip,
            include: {
              products: true,
            },
            where: {
              userId : user.id
            },
            orderBy:{
              id: 'desc'
            }
          })
          return NextResponse.json(orders)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      const data: CheckoutFormSchemaType = await req.json()
      CheckoutFormSchema.safeParse(data)
      const cart = await prisma?.cart.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          products: true,
        },
      })
      if (cart?.products.length === 0 || !cart) {
        return NextResponse.json(
          { message: 'No Cart Found or Empty' },
          { status: 400 }
        )
      }
      const products = cart.products
      const orderCount = await prisma?.orders.count()
      const ordreCreated = await prisma?.orders.create({
        data: {
          code: 'ORD' + zeroPad(orderCount ? orderCount+1 : 1, 5),
          status: 'complete',
          total: calculateTotaOfCart(cart.products),
          contact: data.contact,
          direction: data.direction,
          nameClient: data.nameClient,
          userId: user.id,
          note: data.note,
        },
      })
      if (ordreCreated !== undefined) {
        products.forEach(async (product) => {
          await prisma?.productsOnOrder.create({
            data: {
              discount: 0,
              productCode: product.productCode,
              productId: product.productId,
              productName: product.productName,
              productPrice: product.productPrice,
              quantity: product.quantity,
              ordersId: ordreCreated?.id,
            },
          })
        })
      }
      await prisma?.productsOnCart.deleteMany({where:{
        cartId: cart.id
      }})
      return NextResponse.json({message: 'Order Created', order: ordreCreated})
    }
  } catch (error) {
    return NextResponse.json({message: 'error server'}, {status:500})
  }
}
